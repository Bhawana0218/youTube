'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosinstance';
import { useUser } from '@/lib/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';

declare global {
    interface Window {
        Razorpay?: any;
    }
}

const plans = [
    {
        id: 'bronze',
        title: 'Bronze',
        price: 10,
        limit: '7 Minutes',
        badge: 'Starter',
        gradient: 'from-amber-500 to-orange-500',
        border: 'border-amber-200',
        button: 'bg-amber-500 hover:bg-amber-600',
        features: [
            'Watch videos up to 7 minutes',
            'Faster access',
            'Basic premium support',
        ],
    },

    {
        id: 'silver',
        title: 'Silver',
        price: 50,
        limit: '10 Minutes',
        badge: 'Popular',
        gradient: 'from-gray-400 to-gray-600',
        border: 'border-gray-300',
        button: 'bg-gray-900 hover:bg-black',
        features: [
            'Watch videos up to 10 minutes',
            'Priority streaming',
            'Silver member badge',
        ],
    },

    {
        id: 'gold',
        title: 'Gold',
        price: 100,
        limit: 'Unlimited',
        badge: 'Best Value',
        gradient: 'from-yellow-400 to-yellow-600',
        border: 'border-yellow-300',
        button: 'bg-yellow-500 hover:bg-yellow-600',
        features: [
            'Unlimited video watching',
            'Highest priority access',
            'Gold premium badge',
        ],
    },
];

const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');

        script.src =
            'https://checkout.razorpay.com/v1/checkout.js';

        script.async = true;

        script.onload = () => resolve(true);

        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });

const PlanPage = () => {
    const { user, login } = useUser() as {
        user: {
            id: string;
            name: string;
            email?: string;
            plan?: string;
        } | null;

        login: (userData: any) => void;
    };

    const [loadingPlan, setLoadingPlan] =
        useState<string | null>(null);

    const [currentPlan, setCurrentPlan] =
        useState('free');

    useEffect(() => {
        const fetchPlan = async () => {
            if (!user?.id) return;

            try {
                const res = await axiosInstance.get(
                    `/premium/status/${user.id}`
                );

                if (res.data?.premiumPlan) {
                    setCurrentPlan(res.data.premiumPlan);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchPlan();
    }, [user?.id]);

    const handleUpgrade = async (
        selectedPlan: string
    ) => {
        if (!user?.id) {
            alert('Please sign in first.');
            return;
        }

        try {
            setLoadingPlan(selectedPlan);

            const scriptLoaded =
                await loadRazorpayScript();

            if (!scriptLoaded) {
                alert('Unable to load Razorpay.');
                return;
            }

            const orderRes =
                await axiosInstance.post(
                    '/premium/create-order',
                    {
                        userId: user.id,
                        plan: selectedPlan,
                    }
                );

            const options = {
                key: orderRes.data?.keyId,

                amount: orderRes.data?.amount,

                currency: orderRes.data?.currency,

                name: 'Video Streaming Premium',

                description: `${selectedPlan.toUpperCase()} Plan`,

                order_id: orderRes.data?.orderId,

                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    try {
                        const verifyRes =
                            await axiosInstance.post(
                                '/premium/verify',
                                {
                                    userId: user.id,
                                    plan: selectedPlan,
                                    ...response,
                                }
                            );

                        if (verifyRes.data?.user) {
                            const updatedUser =
                                verifyRes.data.user;

                            if (
                                updatedUser._id &&
                                !updatedUser.id
                            ) {
                                updatedUser.id =
                                    updatedUser._id;

                                delete updatedUser._id;
                            }

                            login(updatedUser);
                        }

                        setCurrentPlan(selectedPlan);

                        alert(
                            'Plan upgraded successfully!'
                        );
                    } catch (error: any) {
                        console.log(error);

                        alert(
                            error?.response?.data?.message ||
                            'Payment verification failed.'
                        );
                    }
                },

                prefill: {
                    name: user.name || '',
                    email: user.email || '',
                },

                theme: {
                    color: '#111827',
                },
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();
        } catch (error: any) {
            console.log(error);

            alert(
                error?.response?.data?.message ||
                'Unable to start payment.'
            );
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 px-4 text-gray-900">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center">

                    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-2 text-sm text-gray-600 shadow-sm">
                        Current Plan:
                        <span className="ml-2 capitalize font-semibold text-blue-600">
                            {currentPlan}
                        </span>
                    </div>

                    <h1 className="mt-8 text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                        Upgrade Your Experience
                    </h1>

                    <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
                        Unlock premium streaming with better
                        watch limits, faster access, and
                        exclusive membership benefits.
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">

                    {plans.map((plan) => {
                        const isCurrentPlan =
                            currentPlan === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={`relative overflow-hidden rounded-3xl border ${plan.border} bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                            >
                                {/* Top Glow */}
                                <div
                                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${plan.gradient}`}
                                />

                                {/* Badge */}
                                <div
                                    className={`inline-flex rounded-full bg-gradient-to-r ${plan.gradient} px-4 py-1 text-xs font-bold uppercase tracking-wide text-white`}
                                >
                                    {plan.badge}
                                </div>

                                {/* Title */}
                                <h2 className="mt-6 text-3xl font-bold">
                                    {plan.title}
                                </h2>

                                {/* Price */}
                                <div className="mt-6 flex items-end gap-2">
                                    <span className="text-6xl font-black">
                                        ₹{plan.price}
                                    </span>

                                    <span className="mb-2 text-gray-400">
                                        / one time
                                    </span>
                                </div>

                                {/* Watch Limit */}
                                <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-5">
                                    <p className="text-sm uppercase tracking-wide text-gray-500">
                                        Watch Limit
                                    </p>

                                    <p className="mt-2 text-2xl font-bold">
                                        {plan.limit}
                                    </p>
                                </div>

                                {/* Features */}
                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3 text-gray-700"
                                        >
                                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />

                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Button */}
                                <button
                                    disabled={
                                        loadingPlan === plan.id ||
                                        isCurrentPlan
                                    }
                                    onClick={() =>
                                        handleUpgrade(plan.id)
                                    }
                                    className={`mt-10 w-full rounded-2xl py-4 text-sm font-bold transition-all duration-300 ${isCurrentPlan
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                                            : `${plan.button} text-white hover:scale-[1.02] active:scale-[0.98]`
                                        }`}
                                >
                                    {isCurrentPlan
                                        ? 'Current Plan'
                                        : loadingPlan === plan.id
                                            ? 'Processing...'
                                            : `Upgrade to ${plan.title}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlanPage;

PlanPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Header />
      <div className="flex flex-col md:flex-row">
        <aside className="hidden md:block md:w-72 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 bg-white">
          <Sidebar />
        </aside>
        <main className="flex-1">
          {page}
        </main>
      </div>
    </div>
  );
};