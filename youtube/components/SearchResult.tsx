import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "@/lib/axiosinstance";

const SearchResult = ({ query }: { query: string }) => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            if (!query) {
                setVideos([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await axiosInstance.get("/video/getall");
                const allVideos = Array.isArray(res.data) ? res.data : [];
                const lowerQuery = query.toLowerCase();

                const filtered = allVideos.filter((video: any) => {
                    return (
                        String(video.videotitle || "").toLowerCase().includes(lowerQuery) ||
                        String(video.videochannel || "").toLowerCase().includes(lowerQuery) ||
                        String(video.uploader || "").toLowerCase().includes(lowerQuery)
                    );
                });

                setVideos(filtered);
            } catch (error) {
                console.error("Search fetch failed", error);
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [query]);

    if (!query) {
        return (
            <div>
                <p>Enter a Search Term to find Videos</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500">
                Loading videos...
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
            {videos.map((video) => {
                const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${String(video.filepath || "").replace(/\\/g, "/")}`;
                return (
                    <div key={video._id} className="group cursor-pointer">
                        <Link href={`/watch/${video._id}`} className="flex gap-4">
                            <div className="relative w-40 md:w-64 aspect-video rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <video
                                    src={videoUrl}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    muted
                                />

                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                                    10:20
                                </div>
                            </div>

                            <div className="flex flex-col justify-start">
                                <h3 className="text-sm md:text-base font-semibold line-clamp-2 text-gray-900">
                                    {video.videotitle}
                                </h3>

                                <p className="text-sm text-gray-600 mt-1 hover:text-black">
                                    {video.videochannel}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {formatViews(video.views || 0)} views •{" "}
                                    {formatDistanceToNow(new Date(video.createdAt), {
                                        addSuffix: true,
                                    })}
                                </p>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default SearchResult;
