'use client';

import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PremiumPage = () => {
  const { user, login } = useUser() as {
    user: {
      id: string;
      name: string;
      email?: string;
      isPremium?: boolean;
      premiumPlan?: string;
    } | null;
    login: (userData: any) => void;
  };

  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(Boolean(user?.isPremium));

  useEffect(() => {
    const syncPremium = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/premium/status/${user.id}`);
        setIsPremium(Boolean(res.data?.isPremium));
      } catch (error) {
        console.log("Premium status check failed:", error);
      }
    };

    syncPremium();
  }, [user?.id]);

  const startPremiumCheckout = async () => {
    if (!user?.id) {
      alert("Please sign in first.");
      return;
    }

    try {
      setLoading(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Unable to load Razorpay checkout script.");
        return;
      }

      const orderRes = await axiosInstance.post("/premium/create-order", {
        userId: user.id,
      });

      if (orderRes.data?.alreadyPremium) {
        setIsPremium(true);
        alert("You are already a premium user.");
        return;
      }

      const options = {
        key: orderRes.data?.keyId,
        amount: orderRes.data?.amount,
        currency: orderRes.data?.currency,
        name: "YouTube Premium",
        description: "Unlimited video downloads",
        order_id: orderRes.data?.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await axiosInstance.post("/premium/verify", {
              userId: user.id,
              ...response,
            });

            if (verifyRes.data?.user) {
              const updatedUser = verifyRes.data.user;
              if (updatedUser._id && !updatedUser.id) {
                updatedUser.id = updatedUser._id;
                delete updatedUser._id;
              }
              login(updatedUser);
            }
            setIsPremium(true);
            alert("Premium activated successfully.");
          } catch (error) {
            console.log("Payment verify failed:", error);
            const apiMessage =
              (error as any)?.response?.data?.message ||
              (error as any)?.message ||
              "Payment verification failed.";
            alert(apiMessage);
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#111827",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log("Premium checkout error:", error);
      const apiMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Unable to start premium checkout.";
      alert(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Premium Plan</h1>
      <p className="mt-2 text-sm text-gray-600">
        Free users can download 1 video per day. Premium users get unlimited downloads.
      </p>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          Current plan:{" "}
          <span className="font-semibold">{isPremium ? "Premium" : "Free"}</span>
        </p>
      </div>

      {!isPremium && (
        <button
          type="button"
          onClick={startPremiumCheckout}
          disabled={loading}
          className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Processing..." : "Upgrade to Premium"}
        </button>
      )}

      {isPremium && (
        <p className="mt-6 text-sm font-medium text-green-700">
          Premium is active. You can now download unlimited videos.
        </p>
      )}
    </div>
  );
};

export default PremiumPage;
