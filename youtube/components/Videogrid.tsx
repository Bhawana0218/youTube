'use client'

import React, { Suspense } from 'react';
import VideoCard from './VideoCard';
const VideoGrid = () => {

    const VideoGrids = [
        {
            "id": "1",
            "videotitle": "Learn React in 30 Minutes",
            "filename": "react-tutorial.mp4",
            "filetype": "video/mp4",
            "filepath": "/videos/react-tutorial.mp4",
            "filesize": "120MB",
            "videochannel": "Code Academy",
            "like": 12500,
            "views": 245000,
            "uploader": "John Doe",
            "createdAt": "2025-04-20T10:30:00Z"
        },
        {
            "id": "2",
            "videotitle": "Next.js Full Course 2025",
            "filename": "nextjs-course.mp4",
            "filetype": "video/mp4",
            "filepath": "/videos/nextjs-course.mp4",
            "filesize": "350MB",
            "videochannel": "Dev Simplified",
            "like": 45200,
            "views": 780000,
            "uploader": "Sarah Lee",
            "createdAt": "2025-04-18T08:15:00Z"
        },
        {
            "id": "3",
            "videotitle": "Top 10 JavaScript Tricks",
            "filename": "js-tricks.mp4",
            "filetype": "video/mp4",
            "filepath": "/videos/js-tricks.mp4",
            "filesize": "90MB",
            "videochannel": "JS Mastery",
            "like": 9800,
            "views": 150000,
            "uploader": "Alex Smith",
            "createdAt": "2025-04-15T14:00:00Z"
        },
        {
            "id": "4",
            "videotitle": "Build YouTube Clone with React",
            "filename": "youtube-clone.mp4",
            "filetype": "video/mp4",
            "filepath": "/videos/youtube-clone.mp4",
            "filesize": "500MB",
            "videochannel": "FullStack Dev",
            "like": 22000,
            "views": 410000,
            "uploader": "Michael Chen",
            "createdAt": "2025-04-10T12:00:00Z"
        },
        {
            "id": "5",
            "videotitle": "Tailwind CSS Crash Course",
            "filename": "tailwind-course.mp4",
            "filetype": "video/mp4",
            "filepath": "/videos/tailwind-course.mp4",
            "filesize": "200MB",
            "videochannel": "Design Code",
            "like": 30500,
            "views": 520000,
            "uploader": "Emily Davis",
            "createdAt": "2025-04-05T09:45:00Z"
        },
    ]
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>         
            {
                VideoGrids.map((video) => (
                    
                <VideoCard key={video.id} video={video} />
                ))
            }
        </div>
    );
}
export default VideoGrid;