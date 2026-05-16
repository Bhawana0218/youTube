import DownloadsContent from "@/components/DownloadsContent";
import React, { Suspense } from "react";

const DownloadsPage = () => {
  return (
    <>
      <div className="mb-6 mt-10">
        <h1 className="text-2xl font-semibold text-gray-900">Downloads</h1>
        <p className="text-sm text-gray-500">
          Videos you downloaded are available here.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-40 text-gray-500">
            Loading your downloads...
          </div>
        }
      >
        <DownloadsContent />
      </Suspense>
    </>
  );
};

export default DownloadsPage;
