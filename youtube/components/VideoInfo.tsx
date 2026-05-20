'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
    Clock3,
    Download,
    MoreHorizontal,
    Share2,
    ThumbsDown,
    ThumbsUp
} from 'lucide-react';

import axiosInstance from '@/lib/axiosinstance';
import { useUser } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

const VideoInfo = ({ video }: any) => {
    const router = useRouter();
    const [likes, setLikes] = useState<number>(video.like || 0);
    const [dislikes, setDislikes] = useState<number>(video.dislike || 0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [watchLater, setWatchLater] = useState(false);
    const { user } = useUser() as {
        user: {
            id: string;
            name: string;
            image: string;
            email?: string;
            channelname?: string;
            isPremium?: boolean;
        } | null;

        loading: boolean;
        login: (userData: any) => void;
        logout: () => Promise<void>;
        handlegooglesignin: () => Promise<void>;
    };

    useEffect(() => {
        setLikes(video.like || 0);
        setDislikes(video.dislike || 0);
        setLiked(false);
        setDisliked(false);
        setShowFullDescription(false);
    }, [video]);

    useEffect(() => {
        const handleViews = async () => {
            if (!user) return;
            try {
                await axiosInstance.post(`/history/${video._id}`, {
                    userId: user.id,
                });
            } catch (error) {
                console.log(error);
            }
        };
        handleViews();
    }, [video._id, user]);

    useEffect(() => {
        if (!video || !user) return;
        const checkWatchLater = async () => {
            try {
                const res = await axiosInstance.get(
                    `/watchlater/check/${video._id}`,
                    {
                        params: {
                            userId: user.id
                        }
                    }
                );
                setWatchLater(res.data.saved);
            } catch (error) {
                console.log(error);
            }
        };
        checkWatchLater();
    }, [video, user]);

    const handleShare = async () => {
        try {
            const videoUrl = `${window.location.origin}/watch/${video._id}`;
            await navigator.clipboard.writeText(videoUrl);
            alert("Video link copied!");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDownload = async () => {
        if (!user?.id) {
            alert("Please login first");
            return;
        }

        try {
            const res = await axiosInstance.post(
                "/download/request",
                {
                    userId: user.id,
                    videoId: video._id,
                }
            );

            const relativeUrl = res.data?.downloadUrl;

            if (!relativeUrl) {
                alert("Download URL missing");
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

            const fileUrl = `${baseUrl}${relativeUrl}`;

            const a = document.createElement("a");

            a.href = fileUrl;

            a.download =
                `${video.videotitle || "video"}.mp4`;

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);

        } catch (error: any) {

            console.log(error);

            if (
                error?.response?.status === 403 &&
                error?.response?.data?.requiresPremium
            ) {

                const upgrade = window.confirm(
                    "Free download limit reached. Upgrade to Premium?"
                );

                if (upgrade) {
                    router.push("/plans");
                }

                return;
            }

            alert("Unable to download video");
        }
    };

    const handleLike = async () => {
        if (!user) return;
        try {
            const res = await axiosInstance.post(
                `/like/${video._id}`,
                {
                    userId: user.id
                }
            );
            if (res.data.liked) {
                setLikes(prev => prev + 1);
                setLiked(true);
                if (disliked) {
                    setDislikes(prev => Math.max(prev - 1, 0));
                    setDisliked(false);
                }
            } else {
                setLikes(prev => Math.max(prev - 1, 0));
                setLiked(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDislike = async () => {
        if (!user) return;
        try {
            const res = await axiosInstance.post(
                `/dislike/${video._id}`,
                {
                    userId: user.id
                }
            );
            if (res.data.disliked) {
                setDislikes(prev => prev + 1);
                setDisliked(true);
                if (liked) {
                    setLikes(prev => Math.max(prev - 1, 0));
                    setLiked(false);
                }
            } else {
                setDislikes(prev => Math.max(prev - 1, 0));
                setDisliked(false);
            }

        } catch (error) {
            console.log(error);
        }
    };
    const handleWatchLater = async () => {
        if (!user) {
            alert("Please login first");
            return;
        }
        try {
            const res = await axiosInstance.post(
                `/watchlater/${video._id}`,
                {
                    userId: user.id
                }
            );
            console.log(res.data);
            setWatchLater(prev => !prev);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="mt-4 space-y-4">
            <h1 className="text-xl font-bold line-clamp-2 leading-tight">
                {video.videotitle}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback>
                            {video.videochannel?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-base text-black font-semibold leading-none">
                            {video.videochannel}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                            1.2M subscribers
                        </span>
                    </div>
                    <Button className="ml-4 rounded-full bg-black hover:bg-zinc-800 text-white px-4 h-9 text-sm font-medium">
                        Subscribe
                    </Button>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center bg-gray-100 rounded-full h-9">
                        <button
                            type='button'
                            onClick={handleLike}
                            className="flex items-center text-black gap-2 px-4 hover:bg-gray-200 border-r border-gray-300 rounded-l-full h-full transition-colors"
                        >
                            <ThumbsUp
                                className={`w-5 h-5 ${liked ? "fill-black text-black" : ""}`}
                            />
                            <span className="text-sm text-black font-medium">
                                {likes}
                            </span>
                        </button>
                        <button
                            type='button'
                            onClick={handleDislike}
                            className="px-4 hover:bg-gray-200 text-black rounded-r-full h-full transition-colors"
                        >
                            <ThumbsDown
                                className={`w-5 h-5 ${disliked ? "fill-black text-black" : ""}`}
                            />
                        </button>
                    </div>
                    <Button
                        onClick={handleShare}
                        variant="secondary"
                        className="rounded-full bg-gray-100 text-black hover:bg-gray-200 gap-2 h-9 px-4"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            Share
                        </span>
                    </Button>
                    <Button
                        type='button'
                        onClick={handleWatchLater}
                        variant="secondary"
                        className={`rounded-full gap-2 h-9 px-4 transition-colors
                        ${watchLater
                                ? "bg-black text-white hover:bg-zinc-800"
                                : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                    >
                        <Clock3
                            className={`w-5 h-5 ${watchLater ? "fill-white" : ""}`}
                        />
                        <span className="text-sm font-medium">
                            {watchLater ? "Saved" : "Watch later"}
                        </span>
                    </Button>
                    <Button
                        onClick={handleDownload}
                        variant="secondary"
                        className="rounded-full text-black bg-gray-100 hover:bg-gray-200 gap-2 h-9 px-4 hidden md:flex"
                    >
                        <Download className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            Download
                        </span>
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full text-black bg-gray-100 hover:bg-gray-200 h-9 w-9"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-3 text-black hover:bg-gray-200 transition-colors group">
                <div className="flex gap-2 text-sm font-bold mb-1">
                    <span>
                        {video.views?.toLocaleString()} views
                    </span>
                    <span>• 2 days ago</span>
                </div>
                <p
                    className={`text-sm whitespace-pre-wrap text-zinc-800 ${showFullDescription ? "" : "line-clamp-2"
                        }`}
                >
                    Welcome to the course! In this video, we'll cover advanced techniques and best practices
                    for building modern web applications. Don't forget to check out the related videos.
                </p>

                <button
                    type='button'
                    onClick={() => setShowFullDescription(prev => !prev)}
                    className="text-sm font-bold mt-2 cursor-pointer hover:underline"
                >
                    {showFullDescription ? 'Show less' : 'Show more'}
                </button>
            </div>
        </div>
    );
}

export default VideoInfo;
