'use client'
import React, { useRef } from 'react';

const Videoplayer = ({ video }: any) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <video 
                ref={videoRef}
                className="w-full h-auto max-h-[500px] rounded-lg bg-black"
                controls
                src={video.filepath}
            />
        </div>
    );
}

export default Videoplayer;
