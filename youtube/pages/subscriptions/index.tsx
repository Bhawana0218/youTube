import React from "react";
import { useUser } from "@/lib/AuthContext";
import VideoGrid from "@/components/Videogrid";

const SubscriptionsPage = () => {
  const { user } = useUser() as any;

  return (
    <>
      <div className="mb-6 mt-10">
        <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
        <p className="text-sm text-gray-500">
          {user
            ? "Videos from channels you are subscribed to will appear here."
            : "Sign in to see your subscriptions."}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
          {user
            ? "Your subscriptions will appear here. Stay connected with the creators and channels you follow."
            : "Please sign in to load your subscriptions."}
        </div>

        <VideoGrid />
      </div>
    </>
  );
};

export default SubscriptionsPage;
