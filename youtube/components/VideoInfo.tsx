'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Download, MoreHorizontal, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';

const VideoInfo = ({ video }: any) => {

    const [likes, setLikes] = useState<number>(video.like || 0);
    const [dislikes, setDislikes] = useState<number>(video.dislike || 0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);


    const user: any = {
        id: '1',
        name: 'Bhawana Bisht',
        email: 'bhawana1205bisht1802@gmail.com',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhpC5WceJkXkT0KYLtmA7t_gYw5x_7_4mr9Io1-Y7w6HtG1CPeELfjuqBrtD2ExOTuTQWswdFM2tPC8tfkdW9SYewrkNkLzsNR_m3Vp2MvGQVlLQbRjU2LEKqr2Qu9_m3Az9kkNrXbB5NBZHuqowO4JETjOXoSQyJhAoFz1k4ZUW6JkV869N8UBJ3ZQaMsV/s1080/Profile%20Picture%20Girl%20Pic.jpg',
    }

    useEffect(() => {
        setLikes(video.like || 0);
        setDislikes(video.dislike || 0);
        setLiked(false);
        setDisliked(false);
        setShowFullDescription(false);
    }, [video]);

    const handleLike = () => {
        if (!user) return;

        if (liked) {
            setLikes(prev => prev - 1);
            setLiked(false);
        } else {
            setLikes(prev => prev + 1);
            setLiked(true);

            if (disliked) {
                setDislikes(prev => prev - 1);
                setDisliked(false);
            }
        }
    };

    const handleDislike = () => {
        if (!user) return;

        if (disliked) {
            setDislikes(prev => prev - 1);
            setDisliked(false);
        } else {
            setDislikes(prev => prev + 1);
            setDisliked(true);

            if (liked) {
                setLikes(prev => prev - 1);
                setLiked(false);
            }
        }
    };



    return (
        <div className="mt-4 space-y-4">
            <h1 className="text-xl font-bold line-clamp-2 leading-tight">
                {video.videotitle}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback>{video.videochannel?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-base text-black font-semibold leading-none">{video.videochannel}</span>
                        <span className="text-xs text-gray-500 mt-1">1.2M subscribers</span>
                    </div>
                    <Button className="ml-4 rounded-full bg-black hover:bg-zinc-800 text-white px-4 h-9 text-sm font-medium">
                        Subscribe
                    </Button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center bg-gray-100 rounded-full h-9">
                        <button className="flex items-center text-black gap-2 px-4 hover:bg-gray-200 border-r border-gray-300 rounded-l-full h-full transition-colors">
                            <ThumbsUp className="w-5 h-5" />
                            <span className="text-sm text-black font-medium">12K</span>
                        </button>
                        <button className="px-4 hover:bg-gray-200 text-black rounded-r-full h-full transition-colors">
                            <ThumbsDown className="w-5 h-5" />
                        </button>
                    </div>

                    <Button variant="secondary" className="rounded-full bg-gray-100 text-black hover:bg-gray-200 gap-2 h-9 px-4">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                    </Button>

                    <Button variant="secondary" className="rounded-full text-black bg-gray-100 hover:bg-gray-200 gap-2 h-9 px-4 hidden md:flex">
                        <Download className="w-5 h-5" />
                        <span className="text-sm font-medium">Download</span>
                    </Button>

                    <Button variant="secondary" size="icon" className="rounded-full text-black bg-gray-100 hover:bg-gray-200 h-9 w-9">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-gray-100 rounded-xl p-3 text-black hover:bg-gray-200 transition-colors cursor-pointer group">
                <div className="flex gap-2 text-sm font-bold mb-1">
                    <span>{video.views?.toLocaleString()} views</span>
                    <span>• 2 days ago</span>
                </div>
                <p className="text-sm whitespace-pre-wrap line-clamp-2 text-zinc-800">
                    Welcome to the course! In this video, we'll cover advanced techniques and best practices
                    for building modern web applications. Don't forget to check out the related videos.
                </p>
                <button
                    onClick={() => setShowFullDescription(prev => !prev)}
                    className="text-sm font-bold mt-2 cursor-pointer hover:underline"
                >
                    {showFullDescription ? 'Show less' : 'Show more'}
                </button>
            </div>
        </div>


    );

}
export default VideoInfo;