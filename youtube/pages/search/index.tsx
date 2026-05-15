import SearchResult from "@/components/SearchResult";
import { useRouter } from "next/router";
import React, { Suspense } from "react";

const Search = () => {
    const router = useRouter();
    const { q } = router.query;
    const query = typeof q === "string" ? q : Array.isArray(q) ? q[0] : "";

    return (
        <>
            {/* SEARCH TITLE */}
            {query && (
                <div className="mb-6 mt-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Search Results
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Results for{" "}
                        <span className="font-semibold text-black">
                            "{query}"
                        </span>
                    </p>
                </div>
            )}

            {/* EMPTY STATE */}
            {!query && (
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
                    <SearchResult query={query} />
                </div>
            </Suspense>
        </>
    );
};

export default Search;