import React, { Suspense } from "react";
import WatchLaterContent from "@/components/LikedContent";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Index = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="flex">

                {/* Sidebar */}
                <div className="hidden md:block w-64 border-r bg-white min-h-screen">
                    <Sidebar />
                </div>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">

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

                </main>
            </div>
        </div>
    );
};

export default Index;