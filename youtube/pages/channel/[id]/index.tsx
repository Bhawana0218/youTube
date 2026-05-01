import React from "react";
import { useRouter } from "next/router";
import ChannelHeader from '@/components/ChannelHeader';
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import '@/app/globals.css';
import Channeltabs from "@/components/Channeltabs";
import VideoUploader from "@/components/VideoUploader";
import ChannelVideos from "@/components/ChannelVideos";

const Channel = () => {

    const router = useRouter();
    const { id } = router.query;

    const user: any = {
        id: '1',
        name: 'Bhawana Bisht',
        email: 'bhawana1205bisht1802@gmail.com',
        image: 'https://i.pravatar.cc/150?img=5',
    };

    try {
        let channel = {
            id: id,
            name: 'Tech Channel',
            email: 'bbisht@gmail.com',
            image: 'https://i.pravatar.cc/150?img=5',
            description: 'Welcome to our channel where we share tutorials on various technologies. Subscribe to our chnanel to stay updated.',
            joinedOn: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),

        }

        if (!channel) {
            return <div>Channel Not Found</div>
        }


        const ChannelVideo = [
            {
                id: "1",
                videotitle: "Learn React in 30 Minutes",
                filename: "react-tutorial.mp4",
                filetype: "video/mp4",
                filepath: "/videos/v.mp4",
                filesize: "120MB",
                videochannel: "Code Academy",
                like: 12500,
                Dislike: 500,
                views: 245000,
                uploader: "John Doe",
                createdAt: "2025-04-20T10:30:00Z"
            },
            {
                id: "2",
                videotitle: "Next.js Full Course 2025",
                filename: "nextjs-course.mp4",
                filetype: "video/mp4",
                filepath: "/videos/v.mp4",
                filesize: "350MB",
                videochannel: "Dev Simplified",
                like: 45200,
                Dislike: 1200,
                views: 780000,
                uploader: "Sarah Lee",
                createdAt: "2025-04-18T08:15:00Z"
            },
        ];

        return (
            <div>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="flex">
                        <div className="hidden md:block w-64 border-r bg-white min-h-screen">
                            <Sidebar />
                        </div>
                    </div>
                    <div className="-mt-184 ml-66">
                        <ChannelHeader channel={channel} user={user} />
                        <Channeltabs />
                    </div>
                    <div>
                        <VideoUploader channelId={id} channlName={channel.name} />
                    </div>
                    <div>
                        <ChannelVideos video={ChannelVideo}/>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error is :", error)
    }
}
export default Channel;