import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";

const SearchResult = ({ query }: any) => {
    const [videos, setVideos] = useState<any[]>([]);

    const allVideos = [
        {
            id: "1",
            videotitle: "Learn React in 30 Minutes",
            filename: "react-tutorial.mp4",
            filetype: "video/mp4",
            filepath: "/videos/react-tutorial.mp4",
            filesize: "120MB",
            videochannel: "Code Academy",
            like: 12500,
            views: 245000,
            uploader: "John Doe",
            createdAt: "2025-04-20T10:30:00Z",
        },
        {
            id: "2",
            videotitle: "Next.js Full Course 2025",
            filename: "nextjs-course.mp4",
            filetype: "video/mp4",
            filepath: "/videos/nextjs-course.mp4",
            filesize: "350MB",
            videochannel: "Dev Simplified",
            like: 45200,
            views: 780000,
            uploader: "Sarah Lee",
            createdAt: "2025-04-18T08:15:00Z",
        },
    ];

    useEffect(() => {
        if (!query) {
            setVideos([]);
            return;
        }

        const result = allVideos.filter(
            (v) =>
                v.videotitle.toLowerCase().includes(query.toLowerCase()) ||
                v.videochannel.toLowerCase().includes(query.toLowerCase())
        );

        setVideos(result);
    }, [query]);

    if (!query) {
        return (
            <div>
                <p>Enter a Search Term to find Videos</p>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-xl font-semibold mb-2">No Results Found</h1>
                <p className="text-gray-600">
                    Try different keywords or remove search filters
                </p>
            </div>
        );
    }

    const formatViews = (num: number) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num;
    };

    return (
       <div className="flex flex-col gap-5">
        {videos.map((video) => (
            <div key={video.id} className="group cursor-pointer">
                <Link href={`/watch/${video.id}`} className="flex gap-4">

                    {/* THUMBNAIL (SMALLER FIX) */}
                    <div className="relative w-40 md:w-64 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <video
                            src="/videos/v.mp4"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            muted
                        />

                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                            10:20
                        </div>
                    </div>

                    {/* TEXT CONTENT */}
                    <div className="flex flex-col justify-start">

                        <h3 className="text-sm md:text-base font-semibold line-clamp-2 text-gray-900">
                            {video.videotitle}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1 hover:text-black">
                            {video.videochannel}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            {formatViews(video.views)} views •{" "}
                            {formatDistanceToNow(new Date(video.createdAt), {
                                addSuffix: true,
                            })}
                        </p>

                    </div>

                </Link>
            </div>
        ))}
    </div>
    );
};

export default SearchResult;