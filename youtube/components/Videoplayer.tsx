'use client'

import React from 'react';

const Videoplayer = ({ video }: any) => {

    const videoUrl =
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${video?.filepath?.replace(/\\/g, "/")}`;

    return (
        <div className="w-full max-w-4xl mx-auto">

            <video
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