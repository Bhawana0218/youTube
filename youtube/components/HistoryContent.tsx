'use client';

import '@/app/globals.css';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MoreVertical, X } from "lucide-react";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import axiosInstance from '@/lib/axiosinstance';
import { useUser } from '@/lib/AuthContext';

interface Video {
  _id: string;
  videotitle: string;
  videochannel?: string;
  views?: number;
  createdAt?: string;
  filepath?: string;
}

interface HistoryItem {
  _id: string;
  videoid: Video | string;
  viewer: string;
  createdAt: string;
}

const HistoryContent = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser() as any;

  const loadHistory = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/history/${user?.id}`);
      const data = res.data || [];

      setHistory(data);

    } catch (error) {
      console.log("Error fetching history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    loadHistory();
  }, [user?.id]);

  const handleRemoveHistory = async (historyId: string) => {
    try {
      await axiosInstance.delete(`/history/${historyId}`);
      setHistory((prev) => prev.filter((h) => h._id !== historyId));
    } catch (error) {
      console.log("Error removing history:", error);
    }
  };
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
        <Clock className="w-10 h-10 mb-2" />
        <h1 className="text-lg font-semibold">Keep Track of what you Watch</h1>
        <p className="text-sm">Watch History is not viewable until you sign in.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
        <Clock className="w-10 h-10 mb-2" />
        <h1 className="text-lg font-semibold">No Watch History yet</h1>
        <p className="text-sm">Videos you watch will appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-800">
          Watch History ({history.length})
        </p>
      </div>

      <div className="space-y-4">
        {history.map((item) => {
          const video = typeof item.videoid === "object" && item.videoid !== null ? item.videoid : null;
          const videoId = typeof item.videoid === "string" ? item.videoid : item.videoid?._id;

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
                    {video?.videotitle || "Untitled Video"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {video?.videochannel} • {video?.views?.toLocaleString() || 0} views •{" "}
                    {video?.createdAt
                      ? formatDistanceToNow(new Date(video.createdAt)) + " ago"
                      : "Recently"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Watched {formatDistanceToNow(new Date(item.createdAt))} ago
                  </p>
                </Link>

              </div>

              {/* Actions */}
              <div className="mr-[50%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                      <MoreVertical className="w-5 h-5 text-black" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-32">
                    <DropdownMenuItem
                      onClick={() => handleRemoveHistory(item._id)}
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

export default HistoryContent;
