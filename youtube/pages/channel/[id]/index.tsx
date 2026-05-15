"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import Channeltabs from "@/components/Channeltabs";
import VideoUploader from "@/components/VideoUploader";
import ChannelVideos from "@/components/ChannelVideos";

import { useUser } from "@/lib/AuthContext";

interface UserType {
    id: string;
    name: string;
    image: string;
    email?: string;
    channelname?: string;
    description?: string;
}

interface ChannelType {
    id: string;
    name: string;
    image: string;
    email?: string;
    description: string;
    subscribers: string;
    totalVideos: number;
    joinedOn: string;
}
const Channel = () => {
    const router = useRouter();
    const { id } = router.query;
    const { user, loading } = useUser() as {
        user: UserType | null;
        loading: boolean;
    };
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const isOwnChannel = useMemo(() => {
        if (!user || !id) return false;
        return String(user.id) === String(id);
    }, [user, id]);
    useEffect(() => {
        if (!router.isReady) return;
        if (isOwnChannel && user) {
            setChannel({
                id: user.id,
                name: user.channelname || user.name,
                image: user.image,
                email: user.email,
                description:
                    user.description ||
                    "🌿 Welcome to the wildest corner of the internet! Funny animals, forest adventures and entertaining short videos all in one place.",
                subscribers: "1.2K",
                totalVideos: 24,
                joinedOn: "May 2025",
            });

        } else {
            setChannel({
                id: String(id),
                name: "Creative Studio",
                image: "https://i.pravatar.cc/300?img=15",
                email: "creative@gmail.com",
                description:
                    "Creative videos, tutorials and entertainment content uploaded regularly.",
                subscribers: "5.8K",
                totalVideos: 89,
                joinedOn: "Jan 2024",
            });
        }
    }, [router.isReady, isOwnChannel, user, id]);
    if (!router.isReady || loading || !channel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
                    <p className="text-sm text-gray-500">
                        Loading Channel...
                    </p>
                </div>
            </div>
        );
    }

    const channelVideos = [
        {
            id: "1",
            videotitle: "Learn React in 30 Minutes",
            filename: "react-course.mp4",
            filetype: "video/mp4",
            filepath: "/videos/v.mp4",
            filesize: "120MB",
            videochannel: channel.name,
            like: 12500,
            dislike: 500,
            views: 245000,
            uploader: channel.name,
            createdAt: "2025-04-20T10:30:00Z",
        },

        {
            id: "2",
            videotitle: "Master Next.js Full Course",
            filename: "next-course.mp4",
            filetype: "video/mp4",
            filepath: "/videos/v.mp4",
            filesize: "350MB",
            videochannel: channel.name,
            like: 45200,
            dislike: 1200,
            views: 780000,
            uploader: channel.name,
            createdAt: "2025-04-18T08:15:00Z",
        },

        {
            id: "3",
            videotitle: "TypeScript Crash Course",
            filename: "typescript.mp4",
            filetype: "video/mp4",
            filepath: "/videos/v.mp4",
            filesize: "210MB",
            videochannel: channel.name,
            like: 18900,
            dislike: 700,
            views: 510000,
            uploader: channel.name,
            createdAt: "2025-04-15T06:20:00Z",
        },
    ];

    return (
        <main className="min-h-screen bg-[#f8f9fb] mt-8">
            <div className="max-w-[1450px] mx-auto px-4 md:px-6 py-6">
                <section className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-sm">
                    <div className="h-[220px] md:h-[300px] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <div className="px-5 md:px-10 pb-8">
                        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
                            <div className="flex flex-col md:flex-row md:items-end gap-6">
                                <div className="-mt-16 md:-mt-20 relative z-10 shrink-0">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[6px] border-white bg-gray-100 shadow-xl">
                                        <img
                                            src={channel.image}
                                            alt={channel.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2 md:pb-2">
                                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                        {channel.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-500">
                                        <span>
                                            @{channel.name.toLowerCase().replace(/\s+/g, "")}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {channel.subscribers} subscribers
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {channel.totalVideos} videos
                                        </span>
                                    </div>
                                    <p className="max-w-3xl mt-5 text-[15px] leading-7 text-gray-600">
                                        {channel.description}
                                    </p>
                                </div>
                            </div>
                            {isOwnChannel && (
                                <div className="xl:pb-2">
                                    <button className="px-7 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-md">
                                        Customize Channel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                <section className="sticky top-16 z-20 mt-6">
                    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3 shadow-sm">
                        <Channeltabs />
                    </div>
                </section>

                <section className="grid grid-cols-1 2xl:grid-cols-[1fr_370px] gap-6 mt-6 items-start">
                    <div className="min-w-0">
                        <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Channel Videos
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Latest uploaded videos from this channel
                                    </p>
                                </div>
                                <div className="w-fit px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                                    {channelVideos.length} Videos
                                </div>
                            </div>
                            <div className="p-6 overflow-hidden">
                                <div className="w-full overflow-x-hidden">
                                    <ChannelVideos video={channelVideos} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">


                        {isOwnChannel && (
                            <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Upload Video
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Upload and share your content
                                    </p>
                                </div>
                                <div className="p-6">
                                    <VideoUploader
                                        channelId={channel.id}
                                        channelName={channel.name}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    About Channel
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Joined
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-gray-800">
                                            {channel.joinedOn}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Subscribers
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-gray-800">
                                            {channel.subscribers}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 col-span-2">
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Total Videos
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-gray-800">
                                            {channel.totalVideos}
                                        </p>
                                    </div>
                                </div>

                                {channel.email && (
                                    <div className="pt-5 border-t border-gray-100">
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Contact Email
                                        </p>
                                        <p className="mt-2 text-sm text-gray-700 break-all">
                                            {channel.email}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Channel;