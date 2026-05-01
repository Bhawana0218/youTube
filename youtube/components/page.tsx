'use client'

import Videoplayer from '@/components/Videoplayer';
import Link from 'next/link';
import React, { useMemo, use } from 'react';

const allVideos = [
  {
    id: "1",
    videotitle: "Learn React in 30 Minutes",
    filename: "react-tutorial.mp4",
    filetype: "video/mp4",
    filepath: "/videos/v.mp4",
    filesize: "120MB",
    videochannel: "Code Academy",
    like: 12500,
    views: 245000,
    uploader: "John Doe",
    createdAt: "2025-04-20T10:30:00Z"
  },
  {
    id: "2",
    videotitle: "Next.js Full Course 2025",
    filename: "nextjs-course.mp4",
    filetype: "video/mp4",
    filepath: "/videos/v.mp4",
    filesize: "350MB",
    videochannel: "Dev Simplified",
    like: 45200,
    views: 780000,
    uploader: "Sarah Lee",
    createdAt: "2025-04-18T08:15:00Z"
  },
  {
    id: "3",
    videotitle: "Top 10 JavaScript Tricks",
    filename: "js-tricks.mp4",
    filetype: "video/mp4",
    filepath: "/videos/js-tricks.mp4",
    filesize: "90MB",
    videochannel: "JS Mastery",
    like: 9800,
    views: 150000,
    uploader: "Alex Smith",
    createdAt: "2025-04-15T14:00:00Z"
  },
  {
    id: "4",
    videotitle: "Build YouTube Clone with React",
    filename: "youtube-clone.mp4",
    filetype: "video/mp4",
    filepath: "/videos/youtube-clone.mp4",
    filesize: "500MB",
    videochannel: "FullStack Dev",
    like: 22000,
    views: 410000,
    uploader: "Michael Chen",
    createdAt: "2025-04-10T12:00:00Z"
  },
  {
    id: "5",
    videotitle: "Tailwind CSS Crash Course",
    filename: "tailwind-course.mp4",
    filetype: "video/mp4",
    filepath: "/videos/tailwind-course.mp4",
    filesize: "200MB",
    videochannel: "Design Code",
    like: 30500,
    views: 520000,
    uploader: "Emily Davis",
    createdAt: "2025-04-05T09:45:00Z"
  },
];

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const video = useMemo(() => {
    return allVideos.find((v) => v.id === id);
  }, [id]);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Video Not Found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className='max-w-7xl mx-auto p-4'>

        <div className="lg:col-span-2 space-y-4">
          <Videoplayer video={video} />
        </div>

        <div className="space-y-4 mt-8">
          <h2 className="font-semibold text-lg">Related Videos</h2>

          <div className="flex flex-col gap-4">
            {allVideos
              .filter((v) => v.id !== id)
              .map((v) => (
                <Link key={v.id} href={`/watch/${v.id}`} className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg">
                  <video src={v.filepath} className="w-40 h-24 object-cover rounded-md" />
                  <div>
                    <p className="text-sm font-medium line-clamp-2">{v.videotitle}</p>
                    <p className="text-xs text-gray-500">{v.videochannel}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}