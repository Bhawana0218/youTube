'use client'

import React, { Suspense, useEffect, useState } from 'react';
import VideoCard from './VideoCard';
import axiosInstance from '@/lib/axiosinstance';
const VideoGrid = () => {

    // const [VideoGrids, setVideoGrids] = useState<any>(null)
    const [VideoGrids, setVideoGrids] = useState<any[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchvideo = async () => {
            try {
                const res = await axiosInstance.get("/video/getall")
                setVideoGrids(res.data);
            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);
            }
        }
        fetchvideo();
    }, [])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {
                loading ? (<>Loading..</>) : VideoGrids.map((video: any) => (

                    <VideoCard key={video._id} video={video} />
                ))
            }
        </div>
    );
}
export default VideoGrid;