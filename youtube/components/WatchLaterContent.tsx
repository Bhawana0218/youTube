
'use client'

import '@/app/globals.css';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MoreVertical, Video, X } from "lucide-react";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

interface WatchlaterItem {
    id: string;
    videoid: string;
    viewer: string;
    watchedon: string;
    video: {
        id: string;
        videotitle: string;
        videochannel: string;
        views: number;
        createdAt: string;
    };
}

const videos = "./videos/v.mp4";

const WatchLaterContent = () => {

    const user: any = {
        id: '1',
        name: 'Bhawana Bisht',
        email: 'bhawana1205bisht1802@gmail.com',
        image: 'https://i.pravatar.cc/150?img=5',
    };

    const [watchlater, setwatchlater] = useState<WatchlaterItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadwatchlater();
        }
    }, []);

    const loadwatchlater = async () => {
        try {
            const watchlaterData: WatchlaterItem[] = [
                {
                    id: "h1",
                    videoid: "1",
                    viewer: "1",
                    watchedon: new Date(Date.now() - 3600000).toISOString(),
                    video: {
                        id: "1",
                        videotitle: "Amazing Nature Documentary",
                        videochannel: "Nature Channel",
                        views: 4500,
                        createdAt: new Date().toISOString(),
                    },
                },
                {
                    id: "h2",
                    videoid: "2",
                    viewer: "1",
                    watchedon: new Date(Date.now() - 7200000).toISOString(),
                    video: {
                        id: "2",
                        videotitle: "Next.js Full Course 2025",
                        videochannel: "Dev Simplified",
                        views: 780000,
                        createdAt: new Date().toISOString(),
                    },
                },
                {
                    id: "h3",
                    videoid: "3",
                    viewer: "1",
                    watchedon: new Date(Date.now() - 10800000).toISOString(),
                    video: {
                        id: "3",
                        videotitle: "Learn React in 30 Minutes",
                        videochannel: "Code Academy",
                        views: 245000,
                        createdAt: new Date().toISOString(),
                    },
                },
                {
                    id: "h4",
                    videoid: "4",
                    viewer: "1",
                    watchedon: new Date(Date.now() - 14400000).toISOString(),
                    video: {
                        id: "4",
                        videotitle: "JavaScript Crash Course",
                        videochannel: "Programming Hub",
                        views: 125000,
                        createdAt: new Date().toISOString(),
                    },
                },
            ];

            setwatchlater(watchlaterData);
        } catch (error) {
            console.log("Error fetching watchlater videos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemovewatchlater = (watchlaterId: string) => {
        setwatchlater((prev) => prev.filter((h) => h.id !== watchlaterId));
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
                <Clock className="w-10 h-10 mb-2" />
                <h1 className="text-lg font-semibold">See your Watch Later videos</h1>
                <p className="text-sm">
                    Sign in to view your Watch Later playlist
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center mt-10 text-gray-500">
                Loading your Watch Later videos...
            </div>
        );
    }

    if (watchlater.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
                <Clock className="w-10 h-10 mb-2" />
                <h1 className="text-lg font-semibold">No Watch Later videos yet</h1>
                <p className="text-sm">
                    Videos you save to Watch Later will appear here.
                </p>
            </div>
        );
    }

    return (
        <>

            <div className="p-4 md:p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-800">
                        Watch Later Videos ({watchlater.length})
                    </p>
                </div>

                <Button
                    onClick={() => {
                        if (watchlater.length > 0) {
                            window.location.href = `/watch/${watchlater[0].video.id}`;
                        }
                    }}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
                >
                    <Video className="w-4 h-4" />
                    Play All Watch Later
                </Button>


                {/* List */}
                <div className="space-y-4">
                    {watchlater.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 transition"
                        >

                            {/* Video thumbnail */}
                            <Link href={`/watch/${item.video.id}`} className="shrink-0">
                                <div className="w-40 md:w-52 aspect-video overflow-hidden rounded-lg  bg-black group">
                                    <video
                                        src={videos}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="flex-1 min-w-0">

                                <Link href={`/watch/${item.video.id}`}>
                                    <h3 className="text-base md:text-lg font-medium text-gray-900 truncate hover:text-blue-600">
                                        {item.video.videotitle}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {item.video.views.toLocaleString()} views •{" "}
                                        {formatDistanceToNow(new Date(item.video.createdAt))} ago
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Watched {formatDistanceToNow(new Date(item.watchedon))}
                                    </p>
                                </Link>

                            </div>

                            {/* Actions */}
                            <div className="mr-[50%]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                                            <MoreVertical className="w-5 h-5 text-black" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-32">
                                        <DropdownMenuItem
                                            onClick={() => handleRemovewatchlater(item.id)}
                                            className="text-red-500 cursor-pointer flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        </div>
                    ))}
                </div>
            </div>



        </>
    );
};

export default WatchLaterContent;