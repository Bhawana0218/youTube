'use client';

import { useUser } from "@/lib/AuthContext";
import Link from "next/link";

const PremiumDashboard = () => {
  const { user } = useUser() as any;

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">

      <div className="w-full max-w-2xl rounded-3xl border border-gray-800 bg-gray-350 p-10">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-800">
              Current Membership
            </p>

            <h1 className="mt-2 text-5xl font-black capitalize">
              {user?.plan || "free"}
            </h1>
          </div>

          <div className="rounded-full bg-blue-500/20 px-5 py-2 text-blue-400 font-semibold">
            Active
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="rounded-2xl border border-gray-800 bg-white/5 p-6">
            <p className="text-sm text-gray-800">
              Watch Limit
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {user?.plan === "gold"
                ? "Unlimited"
                : user?.plan === "silver"
                ? "10 Minutes"
                : user?.plan === "bronze"
                ? "7 Minutes"
                : "5 Minutes"}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-white/5 p-6">
            <p className="text-sm text-gray-800">
              Membership Status
            </p>

            <h2 className="mt-3 text-3xl font-bold text-green-400">
              Active
            </h2>
          </div>
        </div>

        <Link
          href="/plans"
          className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-gray-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-gray-900"
        >
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
};

export default PremiumDashboard;