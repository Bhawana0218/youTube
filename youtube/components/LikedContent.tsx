
'use client'

import '@/app/globals.css';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MoreVertical, Video, X } from "lucide-react";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import axiosInstance from '@/lib/axiosinstance';
import { useUser } from '@/lib/AuthContext';

interface VideoData {
    _id: string;
    videotitle: string;
    videochannel?: string;
    views?: number;
    createdAt?: string;
    filepath?: string;
}

interface LikedItem {
    _id: string;
    videoid: VideoData | string;
    viewer: string;
    createdAt: string;
}

const LikedContent = () => {
    const { user } = useUser() as any;
    const [liked, setLiked] = useState<LikedItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLiked = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.get(`/like/${user.id}`);
            setLiked(res.data || []);
        } catch (error) {
            console.log("Error fetching liked videos", error);
            setLiked([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLiked();
    }, [user?.id]);

    const handleRemoveLiked = async (likedId: string, videoId: string) => {
        try {
            await axiosInstance.post(`/like/${videoId}`, { userId: user?.id });
            setLiked((prev) => prev.filter((item) => item._id !== likedId));
        } catch (error) {
            console.log("Error removing liked item:", error);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
                <Clock className="w-10 h-10 mb-2" />
                <h1 className="text-lg font-semibold">See your liked videos</h1>
                <p className="text-sm">Sign in to see your Liked videos and playlists</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center mt-10 text-gray-500">
                Loading your liked videos...
            </div>
        );
    }

    if (!liked.length) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
                <Clock className="w-10 h-10 mb-2" />
                <h1 className="text-lg font-semibold">No liked videos yet</h1>
                <p className="text-sm">Videos you like will appear here.</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-800">Liked Videos ({liked.length})</p>
            </div>

            <Button
                onClick={() => {
                    const firstPlayable = liked.find((item) => {
                        const id = typeof item.videoid === 'string' ? item.videoid : item.videoid?._id;
                        return Boolean(id);
                    });
                    const videoId = firstPlayable
                        ? (typeof firstPlayable.videoid === 'string' ? firstPlayable.videoid : firstPlayable.videoid?._id)
                        : '';
                    if (videoId) {
                        window.location.href = `/watch/${videoId}`;
                    }
                }}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
            >
                <Video className="w-4 h-4" />
                Play First Liked
            </Button>

            <div className="space-y-4">
                {liked.map((item) => {
                    const video = typeof item.videoid === 'object' && item.videoid !== null ? item.videoid : null;
                    const videoId = typeof item.videoid === 'string' ? item.videoid : item.videoid?._id;

                    if (!videoId) {
                        return null;
                    }

                    return (
                        <div
                            key={item._id}
                            className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 transition"
                        >
                            <Link href={`/watch/${videoId}`} className="shrink-0">
                                <div className="w-40 md:w-52 aspect-video overflow-hidden rounded-lg bg-black group">
                                    <video
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video?.filepath?.replace(/\\/g, "/")}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        muted
                                    />
                                </div>
                            </Link>

                            <div className="flex-1 min-w-0">
                                <Link href={`/watch/${videoId}`}>
                                    <h3 className="text-base md:text-lg font-medium text-gray-900 truncate hover:text-blue-600">
                                        {video?.videotitle || 'Untitled Video'}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {video?.videochannel || 'Unknown channel'} • {video?.views?.toLocaleString() || 0} views •{' '}
                                        {video?.createdAt
                                            ? formatDistanceToNow(new Date(video.createdAt)) + ' ago'
                                            : 'Recently'}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Added {item.createdAt ? formatDistanceToNow(new Date(item.createdAt)) + ' ago' : 'recently'}
                                    </p>
                                </Link>
                            </div>

                            <div className="mr-[50%]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                                            <MoreVertical className="w-5 h-5 text-black" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-32">
                                        <DropdownMenuItem
                                            onClick={() => handleRemoveLiked(item._id, videoId)}
                                            className="text-red-500 cursor-pointer flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LikedContent;
