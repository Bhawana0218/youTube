import React, { Suspense } from "react";
import WatchLaterContent from "@/components/LikedContent";

const Index = () => {
    return (
        <>
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Watch Later
                </h1>
                <p className="text-sm text-gray-500">
                    Videos you saved to watch later
                </p>
            </div>

            {/* Content */}
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-40 text-gray-500">
                        Loading your watch later videos...
                    </div>
                }
            >
                <WatchLaterContent />
            </Suspense>
        </>
    );
};

export default Index;