import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import User from "../models/Auth.js";

const PREMIUM_AMOUNT = Number(process.env.PREMIUM_PLAN_AMOUNT || 19900); // paise
const PREMIUM_CURRENCY = process.env.PREMIUM_CURRENCY || "INR";
const RAZORPAY_API = "https://api.razorpay.com/v1/orders";

const getRazorpayCreds = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return { keyId, keySecret };
};

export const createPremiumOrder = async (req, res) => {
  try {
    const { userId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(String(userId || ""))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isPremium) {
      return res.status(200).json({
        success: true,
        alreadyPremium: true,
        message: "You are already a premium user.",
      });
    }

    const { keyId, keySecret } = getRazorpayCreds();
    if (!keyId || !keySecret) {
      return res.status(500).json({
        message: "Razorpay credentials are not configured.",
      });
    }

    const authToken = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const receipt = `prem_${userId}_${Date.now()}`;

    const response = await fetch(RAZORPAY_API, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: PREMIUM_AMOUNT,
        currency: PREMIUM_CURRENCY,
        receipt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(502).json({
        message: "Unable to create Razorpay order.",
        error: errorData,
      });
    }

    const order = await response.json();

    await Payment.create({
      viewer: userId,
      amount: PREMIUM_AMOUNT,
      currency: PREMIUM_CURRENCY,
      orderId: order.id,
      status: "created",
    });

    return res.status(200).json({
      success: true,
      keyId,
      amount: PREMIUM_AMOUNT,
      currency: PREMIUM_CURRENCY,
      orderId: order.id,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Create premium order error:", error);
    return res.status(500).json({
      message: "Something went wrong while creating premium order.",
    });
  }
};

export const verifyPremiumPayment = async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(String(userId || ""))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Incomplete payment details." });
    }

    const { keySecret } = getRazorpayCreds();
    if (!keySecret) {
      return res.status(500).json({ message: "Razorpay secret is not configured." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { $set: { status: "failed", paymentId: razorpay_payment_id, signature: razorpay_signature } }
      );

      return res.status(400).json({
        message: "Payment verification failed.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isPremium: true,
          premiumPlan: "premium",
          premiumActivatedAt: new Date(),
          premiumPaymentId: razorpay_payment_id,
        },
      },
      { new: true }
    );

    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        $set: {
          status: "paid",
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Premium activated successfully.",
      user,
    });
  } catch (error) {
    console.log("Verify premium payment error:", error);
    return res.status(500).json({
      message: "Something went wrong while verifying payment.",
    });
  }
};

export const getPremiumStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(String(userId || ""))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select(
      "isPremium premiumPlan premiumActivatedAt premiumPaymentId"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      isPremium: Boolean(user.isPremium),
      premiumPlan: user.premiumPlan || "free",
      premiumActivatedAt: user.premiumActivatedAt || null,
    });
  } catch (error) {
    console.log("Get premium status error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching premium status.",
    });
  }
};
