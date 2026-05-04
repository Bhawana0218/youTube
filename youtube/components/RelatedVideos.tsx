'use client'

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import React from "react";

const vid = "/videos/v.mp4";

const RelatedVideos = ({ video }: any) => {
    return (
        <div className="flex flex-col gap-4">

            {video.map((v: any) => (
                <Link
                    key={v._id}
                    href={`/watch/${v._id}`}
                    className="flex gap-3 group cursor-pointer"
                >
                    {/* THUMBNAIL */}
                    <div className="relative w-40 h-[94px] flex-shrink-0 rounded-lg overflow-hidden bg-black">

                        <video
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${v.filepath}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            muted
                        />

                        {/* DURATION */}
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                            10:20
                        </span>
                    </div>

                    {/* TEXT CONTENT */}
                    <div className="flex flex-col min-w-0">

                        {/* TITLE */}
                        <h3 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-blue-600 transition">
                            {v.videotitle}
                        </h3>

                        {/* CHANNEL */}
                        <p className="text-xs text-gray-600 mt-1 hover:text-black">
                            {v.videochannel}
                        </p>

                        {/* META */}
                        <p className="text-xs text-gray-500">
                            {v.views.toLocaleString()} views •{" "}
                            {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </Link>
            ))}

        </div>
    );
};

export default RelatedVideos;