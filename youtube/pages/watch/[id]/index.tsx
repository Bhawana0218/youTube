import Videoplayer from '@/components/Videoplayer';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import VideoInfo from '@/components/VideoInfo';
import Comments from '@/components/Comments';
import RelatedVideos from '@/components/RelatedVideos';
import axiosInstance from '@/lib/axiosinstance';

export default function Index() {

  const router = useRouter();
  const { id } = router.query;

  const [video, setVideo] = useState<any>(null);
  const [relatedVideo, setRelatedVideo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const videoId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!videoId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const videoRes = await axiosInstance.get(`/video/${videoId}`);
        setVideo(videoRes.data);
        const allRes = await axiosInstance.get("/video/getall");
        setRelatedVideo(allRes.data);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  if (loading || !video) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:px-8">

      {/* LEFT */}
      <div className="flex-1 lg:w-[70%]">
        <div className="flex flex-col gap-4">
          <Videoplayer video={video} />
          <VideoInfo video={video} />
          <Comments videoId={videoId} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:w-[350px] flex-shrink-0 lg:sticky lg:top-20 h-fit mr-20">
        <RelatedVideos
          video={relatedVideo.filter((v) => v._id !== videoId)}
        />
      </div>

    </div>
  );
}