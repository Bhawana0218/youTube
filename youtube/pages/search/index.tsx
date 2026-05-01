import SearchResult from "@/components/SearchResult";
import { useRouter } from "next/router";
import React, { Suspense } from "react";
import "@/app/globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Search = () => {
    const router = useRouter();
    const { q } = router.query;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HEADER */}
            <Header />

            <div className="flex">
                {/* SIDEBAR */}
                <aside className="hidden md:block w-64 border-r bg-white min-h-screen">
                    <Sidebar />
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-4 md:p-8">
                    
                    {/* SEARCH TITLE */}
                    {q && (
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Search Results
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Results for{" "}
                                <span className="font-semibold text-black">
                                    "{q}"
                                </span>
                            </p>
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!q && (
                        <div className="flex items-center justify-center h-[60vh] text-gray-500">
                            <p className="text-lg">
                                Start typing to search videos...
                            </p>
                        </div>
                    )}

                    {/* RESULTS */}
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-40 text-gray-500">
                                Loading results...
                            </div>
                        }
                    >
                        <div className="grid gap-6">
                            <SearchResult query={q || ""} />
                        </div>
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default Search;