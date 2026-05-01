'use client'

import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video }: any) => {

  const videos="/videos/v.mp4";

    const formatViews = (num: number) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num;
    };

    return (
        <div className="group cursor-pointer">
            <Link href={`/watch/${video.id}`}>

                {/* VIDEO THUMBNAIL */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <video
                        src={videos}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        muted
                    />

                    {/* DURATION */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                        10:20
                    </div>
                </div>

                {/* VIDEO INFO */}
                <div className="flex gap-3 mt-3">

                    {/* AVATAR */}
                    <Avatar className="w-9 h-9">
                        <AvatarFallback>
                            {video.videochannel?.[0]}
                        </AvatarFallback>
                    </Avatar>

                    {/* TEXT CONTENT */}
                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold line-clamp-2">
                            {video.videotitle}
                        </h3>

                        <p className="text-sm text-gray-600 hover:text-black">
                            {video.videochannel}
                        </p>

                        <p className="text-xs text-gray-500">
                            {formatViews(video.views)} views •{" "}
                            {formatDistanceToNow(new Date(video.createdAt), {
                                addSuffix: true,
                            })}
                        </p>
                    </div>

                </div>

            </Link>
        </div>
    );
}

export default VideoCard;






