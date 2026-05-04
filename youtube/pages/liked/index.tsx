import React, { Suspense } from "react";
import LikedContent from "@/components/LikedContent";

const Index = () => {
    return (
        <>
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                   Watch Liked Videos
                </h1>
                <p className="text-sm text-gray-500">
                    Here are the Videos you have Liked
                </p>
            </div>

            {/* Content */}
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-40 text-gray-500">
                        Loading your history...
                    </div>
                }
            >
                <LikedContent />
            </Suspense>
        </>
    );
};

export default Index;