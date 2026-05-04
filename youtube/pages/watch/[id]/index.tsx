import Videoplayer from '@/components/Videoplayer';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import VideoInfo from '@/components/VideoInfo';
import Comments from '@/components/Comments';
import RelatedVideos from '@/components/RelatedVideos';
import axiosInstance from '@/lib/axiosinstance';

export default function Index() {

  const router = useRouter();
  const { id } = router.query;

  const [relatedVideo, setRelatedVideo] = useState<any[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchvideo = async () => {
      try {
        const res = await axiosInstance.get("/video/getall")
        setRelatedVideo(res.data);
      } catch (error) {
        console.log(error);

      } finally {
        setLoading(false);
      }
    }
    fetchvideo();
  }, [])


  const stringid = Array.isArray(id) ? id[0] : id;


  const video = relatedVideo?.find(
    (vid: any) => vid._id === stringid
  );

  if (!router.isReady) return <p>Loading...</p>;
  if (!video) return <p>Video Not Found</p>;



  return (
    <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:px-8">

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

        {/* <RelatedVideos video={relatedVideo} /> */}
        <RelatedVideos
          video={relatedVideo.filter((v) => v._id !== video._id)}
        />

      </div>

    </div>
  );
}