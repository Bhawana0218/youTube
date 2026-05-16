import React from "react";
import VideoCard from "./VideoCard";

const ChannelVideos = ({ video }: any) => {
  return (
    <div className="w-full mt-6 ml-66 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Videos</h2>
        <span className="text-sm text-gray-500">
          {video?.length || 0} uploads
        </span>
      </div>
      {video?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-gray-50">
          <p className="text-gray-600 text-lg font-medium">
            No videos uploaded yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Upload your first video to get started
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {video?.map((v: any) => (
          <VideoCard key={v._id || v.id} video={v} />
        ))}
      </div>
    </div>
  );
};

export default ChannelVideos;
