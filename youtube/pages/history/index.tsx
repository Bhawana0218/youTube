import React, { Suspense } from "react";
import HistoryContent from "@/components/HistoryContent";

const Index = () => {
    return (
        <>
            {/* Page Title */}
            <div className="mb-6">

                <h1 className="text-2xl font-semibold text-gray-900">
                    Watch History
                </h1>
                <p className="text-sm text-gray-500">
                    Videos you recently watched
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
                <HistoryContent />
            </Suspense>
        </>
    );
};

export default Index;