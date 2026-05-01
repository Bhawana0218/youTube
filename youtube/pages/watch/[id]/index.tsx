import Videoplayer from '@/components/Videoplayer';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import "../../../app/globals.css";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoInfo from '@/components/VideoInfo';
import Comments from '@/components/Comments';
import RelatedVideos from '@/components/RelatedVideos';

export default function Index() {

  const router = useRouter();
  const { id } = router.query;


  const stringid = Array.isArray(id) ? id[0] : id;

  const relatedVideo = [
    {
      id: "1",
      videotitle: "Learn React in 30 Minutes",
      filename: "react-tutorial.mp4",
      filetype: "video/mp4",
      filepath: "/videos/v.mp4",
      filesize: "120MB",
      videochannel: "Code Academy",
      like: 12500,
      Dislike: 500,
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
      Dislike: 1200,
      views: 780000,
      uploader: "Sarah Lee",
      createdAt: "2025-04-18T08:15:00Z"
    },
  ];

  const video = useMemo(() => {
    return relatedVideo.find((video) => video.id === stringid);
  }, [stringid]);

  if (!router.isReady) return <p>Loading...</p>;
  if (!video) return <p>Video Not Found</p>;

  return (
    <div className="bg-white min-h-screen ">
      <Header />
      <Sidebar />

      <div className="max-w-[1700px] ml-56 mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:px-8">

        {/* LEFT SIDE */}
        <div className="flex-1 lg:w-[70%]">

          <div className="flex flex-col gap-4">
            <Videoplayer video={video} />
            <VideoInfo video={video} />
            <Comments videoId={id} />
          </div>

        </div>

        {/* RIGHT SIDE (IMPORTANT) */}
        <div className="lg:w-[350px] flex-shrink-0 lg:sticky lg:top-20 h-fit mr-20">

          <RelatedVideos video={relatedVideo} />

        </div>

      </div>
    </div>
  );
}