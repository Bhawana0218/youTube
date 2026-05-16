'use client';

import Comments from '@/components/Comments';
import RelatedVideos from '@/components/RelatedVideos';
import VideoInfo from '@/components/VideoInfo';
import Videoplayer from '@/components/Videoplayer';
import axiosInstance from '@/lib/axiosinstance';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type VideoItem = {
  _id?: string;
};

export default function WatchPage() {
  const params = useParams<{ id: string | string[] }>();
  const idParam = params?.id;
  const videoId = useMemo(
    () => (Array.isArray(idParam) ? idParam[0] : idParam),
    [idParam]
  );

  const [video, setVideo] = useState<Record<string, unknown> | null>(null);
  const [relatedVideo, setRelatedVideo] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const videoRes = await axiosInstance.get(`/video/${videoId}`);
        setVideo(videoRes.data);

        const allRes = await axiosInstance.get('/video/getall');
        setRelatedVideo(allRes.data || []);
      } catch (error) {
        console.log('Error loading watch page:', error);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (!video) {
    return <p className="p-4">Video not found.</p>;
  }

  return (
    <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:px-8 mt-10">
      <div className="flex-1 lg:w-[70%]">
        <div className="flex flex-col gap-4">
          <Videoplayer video={video} />
          <VideoInfo video={video} />
          <Comments videoId={videoId} />
        </div>
      </div>
      <div className="lg:w-[350px] flex-shrink-0 lg:sticky lg:top-20 h-fit mr-20">
        <RelatedVideos video={relatedVideo.filter((v) => v?._id !== videoId)} />
      </div>
    </div>
  );
}
