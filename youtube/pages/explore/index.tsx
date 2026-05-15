import React, { Suspense } from "react";
import ExploreContent from "@/components/ExploreContent";

const ExplorePage = () => {
    return (
        <>
            <div className="mb-6 mt-10">
                <h1 className="text-2xl font-semibold text-gray-900">Explore</h1>
                <p className="text-sm text-gray-500">
                    Browse trending videos from all channels.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-40 text-gray-500">
                        Loading videos...
                    </div>
                }
            >
                <ExploreContent />
            </Suspense>
        </>
    );
};

export default ExplorePage;