import crypto from "crypto";
import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import User from "../models/Auth.js";

import { PLAN_DETAILS } from "../constants/plan.js";
import { sendInvoiceEmail } from "../utils/sendInvoice.js";

const PREMIUM_CURRENCY =
  process.env.PREMIUM_CURRENCY || "INR";

const RAZORPAY_API =
  "https://api.razorpay.com/v1/orders";

const getRazorpayCreds = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET;

  return { keyId, keySecret };
};

export const createPremiumOrder = async (
  req,
  res
) => {
  try {
    const { userId, plan } = req.body || {};

    if (
      !mongoose.Types.ObjectId.isValid(
        String(userId || "")
      )
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!PLAN_DETAILS[plan]) {
      return res.status(400).json({
        message: "Invalid plan selected.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const amount =
      PLAN_DETAILS[plan].amount;

    const { keyId, keySecret } =
      getRazorpayCreds();

    if (!keyId || !keySecret) {
      return res.status(500).json({
        message:
          "Razorpay credentials are missing.",
      });
    }

    const authToken = Buffer.from(
      `${keyId}:${keySecret}`
    ).toString("base64");

    const receipt = `plan_${Date.now()}`;

    const response = await fetch(
      RAZORPAY_API,
      {
        method: "POST",

        headers: {
          Authorization: `Basic ${authToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          amount,
          currency: PREMIUM_CURRENCY,
          receipt,
        }),
      }
    );

    if (!response.ok) {
      const errorData =
        await response.text();

      console.log(errorData);

      return res.status(500).json({
        message:
          "Unable to create Razorpay order.",
      });
    }

    const order = await response.json();

    await Payment.create({
      viewer: userId,

      amount,

      currency: PREMIUM_CURRENCY,

      orderId: order.id,

      status: "created",

      plan,
    });

    return res.status(200).json({
      success: true,

      keyId,

      amount,

      currency: PREMIUM_CURRENCY,

      orderId: order.id,
    });
  } catch (error) {
    console.log(
      "Create premium order error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while creating order.",
    });
  }
};

export const verifyPremiumPayment =
  async (req, res) => {
    try {
      const {
        userId,
        plan,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body || {};

      if (
        !mongoose.Types.ObjectId.isValid(
          String(userId || "")
        )
      ) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }

      const { keySecret } =
        getRazorpayCreds();

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

      if (
        generatedSignature !==
        razorpay_signature
      ) {
        return res.status(400).json({
          message:
            "Payment verification failed.",
        });
      }

      const updatedUser =
        await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              plan,

              watchLimitMinutes:
                PLAN_DETAILS[plan]
                  .watchLimit,

              premiumActivatedAt:
                new Date(),

              premiumPaymentId:
                razorpay_payment_id,
            },
          },
          { new: true }
        );

      await Payment.findOneAndUpdate(
        {
          orderId: razorpay_order_id,
        },
        {
          $set: {
            status: "paid",

            paymentId:
              razorpay_payment_id,

            signature:
              razorpay_signature,
          },
        }
      );

      await sendInvoiceEmail({
        email: updatedUser.email,

        plan,

        amount:
          PLAN_DETAILS[plan].amount,

        paymentId:
          razorpay_payment_id,
      });

      return res.status(200).json({
        success: true,

        message:
          "Plan upgraded successfully.",

        user: updatedUser,
      });
    } catch (error) {
      console.log(
        "Verify premium payment error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while verifying payment.",
      });
    }
  };

export const getPremiumStatus = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        String(userId || "")
      )
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(
      userId
    ).select(
      "plan watchLimitMinutes premiumActivatedAt premiumPaymentId"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      premiumPlan:
        user.plan || "free",

      watchLimitMinutes:
        user.watchLimitMinutes || 5,

      premiumActivatedAt:
        user.premiumActivatedAt ||
        null,
    });
  } catch (error) {
    console.log(
      "Get premium status error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while fetching status.",
    });
  }
};