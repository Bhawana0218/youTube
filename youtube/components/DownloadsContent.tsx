'use client';

import '@/app/globals.css';
import axiosInstance from '@/lib/axiosinstance';
import { useUser } from '@/lib/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Download, Inbox } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface VideoData {
  _id: string;
  videotitle: string;
  videochannel?: string;
  views?: number;
  createdAt?: string;
  filepath?: string;
}

interface DownloadItem {
  _id: string;
  videoid: VideoData | string | null;
  createdAt: string;
}

const DownloadsContent = () => {
  const { user } = useUser() as {
    user: {
      id: string;
      name: string;
      isPremium?: boolean;
    } | null;
  };
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDownloads = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/download/${user.id}`);
        setDownloads(res.data || []);
      } catch (error) {
        console.log("Error fetching downloads:", error);
        setDownloads([]);
      } finally {
        setLoading(false);
      }
    };

    loadDownloads();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
        <Inbox className="w-10 h-10 mb-2" />
        <h1 className="text-lg font-semibold">Your downloads will appear here</h1>
        <p className="text-sm">Sign in to see downloaded videos.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading downloads...</div>;
  }

  const validDownloads = downloads.filter((item) => {
    const videoId = typeof item.videoid === 'string' ? item.videoid : item.videoid?._id;
    return Boolean(videoId);
  });

  if (!validDownloads.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
        <Download className="w-10 h-10 mb-2" />
        <h1 className="text-lg font-semibold">No downloads yet</h1>
        <p className="text-sm">Downloaded videos will be listed here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <p className="text-lg font-semibold text-gray-800">
        Downloads ({validDownloads.length})
      </p>

      <div className="space-y-4">
        {validDownloads.map((item) => {
          const video = typeof item.videoid === 'object' && item.videoid !== null ? item.videoid : null;
          const videoId = typeof item.videoid === 'string' ? item.videoid : item.videoid?._id;
          if (!videoId) return null;

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
                    {video?.videochannel || "Unknown channel"} • {video?.views?.toLocaleString() || 0} views
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Downloaded {formatDistanceToNow(new Date(item.createdAt))} ago
                  </p>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DownloadsContent;
