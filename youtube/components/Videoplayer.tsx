'use client'

import React, { useEffect, useRef } from 'react';
import { useUser } from '@/lib/AuthContext';

const Videoplayer = ({ video }: any) => {

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const { user } = useUser() as {
        user: {
            plan?: string;
        } | null;
    };

    const normalizedPath = String(video?.filepath || "")
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    const videoUrl =
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${normalizedPath}`;

    const PLAN_LIMITS: any = {
        free: 5,
        bronze: 7,
        silver: 10,
        gold: -1,
    };

    useEffect(() => {

        const videoElement = videoRef.current;

        if (!videoElement) return;

        const userPlan = user?.plan || "free";

        const limitMinutes =
            PLAN_LIMITS[userPlan];

        if (limitMinutes === -1) return;

        const limitSeconds =
            limitMinutes * 60;

        const handleTimeUpdate = () => {

            if (
                videoElement.currentTime >=
                limitSeconds
            ) {

                videoElement.pause();

                alert(
                    `Your ${userPlan} plan allows only ${limitMinutes} minutes watching time. Upgrade for more access.`
                );
            }
        };

        videoElement.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        return () => {
            videoElement.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );
        };

    }, [user]);

    return (
        <div className="w-full max-w-4xl mx-auto">

            <video
                ref={videoRef}
                key={video?._id}
                src={videoUrl}
                className="w-full h-auto max-h-[500px] rounded-lg bg-black"
                controls
                autoPlay
                playsInline
                preload="auto"
                controlsList="nodownload"
            />

        </div>
    );
};

export default Videoplayer;