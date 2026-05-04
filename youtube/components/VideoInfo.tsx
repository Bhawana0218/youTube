'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Download, MoreHorizontal, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import axiosInstance from '@/lib/axiosinstance';
import { useUser } from '@/lib/AuthContext';

const VideoInfo = ({ video }: any) => {

    const [likes, setLikes] = useState<number>(video.like || 0);
    const [dislikes, setDislikes] = useState<number>(video.dislike || 0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const { user } = useUser() as {
        user: {
            id: string;
            name: string;
            image: string;
            email?: string;
            channelname?: string;
        } | null;
        loading: boolean;
        login: (userData: any) => void;
        logout: () => Promise<void>;
        handlegooglesignin: () => Promise<void>;
    };

    // const user: any = {
    //     id: '1',
    //     name: 'Bhawana Bisht',
    //     email: 'bhawana1205bisht1802@gmail.com',
    //     image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhpC5WceJkXkT0KYLtmA7t_gYw5x_7_4mr9Io1-Y7w6HtG1CPeELfjuqBrtD2ExOTuTQWswdFM2tPC8tfkdW9SYewrkNkLzsNR_m3Vp2MvGQVlLQbRjU2LEKqr2Qu9_m3Az9kkNrXbB5NBZHuqowO4JETjOXoSQyJhAoFz1k4ZUW6JkV869N8UBJ3ZQaMsV/s1080/Profile%20Picture%20Girl%20Pic.jpg',
    // }

    useEffect(() => {
        setLikes(video.like || 0);
        setDislikes(video.dislike || 0);
        setLiked(false);
        setDisliked(false);
        setShowFullDescription(false);
    }, [video]);

    // const handleLike = async () => {
    //     if (!user) return;

    //     try {
    //         const res = await axiosInstance.post(
    //             `/like/${video._id}`,
    //             {
    //                 userId: user.id
    //             }
    //         );

    //         if (res.data.liked) {

    //             if (liked) {
    //                 setLikes(prev => prev - 1);
    //                 setLiked(false);
    //             } else {

    //                 setLikes(prev => prev + 1);
    //                 setLiked(true);

    //                 if (disliked) {
    //                     setDislikes(prev => prev - 1);
    //                     setDisliked(false);
    //                 }
    //             }
    //         }

    //     } catch (error) {
    //         console.log("Error:", error);
    //     }
    // };

const handleLike = async () => {

    if (!user) return;

    try {

        const res = await axiosInstance.post(
            `/like/${video._id}`,
            {
                userId: user.id
            }
        );

        if (res.data.liked) {

            // User liked video
            setLikes(prev => prev + 1);
            setLiked(true);

            // Remove dislike if active
            if (disliked) {
                setDislikes(prev => Math.max(prev - 1, 0));
                setDisliked(false);
            }

        } else {

            // User unliked video
            setLikes(prev => Math.max(prev - 1, 0));
            setLiked(false);
        }

    } catch (error) {
        console.log(error);
    }
};


        const handleDislike = () => {

            if (!user) return;

            if (disliked) {

                // Remove dislike
                setDislikes(prev => Math.max(prev - 1, 0));
                setDisliked(false);

            } else {

                // Add dislike
                setDislikes(prev => prev + 1);
                setDisliked(true);

                // Remove like if active
                if (liked) {
                    setLikes(prev => Math.max(prev - 1, 0));
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
                            <button
                                type='button'
                                onClick={handleLike}
                                className="flex items-center text-black gap-2 px-4 hover:bg-gray-200 border-r border-gray-300 rounded-l-full h-full transition-colors">
                                <ThumbsUp
                                    className={`w-5 h-5 ${liked ? "fill-black text-black" : ""
                                        }`}
                                />
                                <span className="text-sm text-black font-medium">{likes}</span>
                            </button>
                            <button
                                type='button'
                                onClick={handleDislike}
                                className="px-4 hover:bg-gray-200 text-black rounded-r-full h-full transition-colors">
                                <ThumbsDown
                                    className={`w-5 h-5 ${disliked ? "fill-black text-black" : ""
                                        }`}
                                />
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
                <div className="bg-gray-100 rounded-xl p-3 text-black hover:bg-gray-200 transition-colors group">
                    <div className="flex gap-2 text-sm font-bold mb-1">
                        <span>{video.views?.toLocaleString()} views</span>
                        <span>• 2 days ago</span>
                    </div>
                    <p
                        className={`text-sm whitespace-pre-wrap text-zinc-800 ${showFullDescription ? "" : "line-clamp-2"
                            }`}
                    >
                        Welcome to the course! In this video, we'll cover advanced techniques and best practices
                        for building modern web applications. Don't forget to check out the related videos.
                    </p>
                    <button
                        type='button'
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