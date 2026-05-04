// import React from "react";
// import { useRouter } from "next/router";
// import ChannelHeader from '@/components/ChannelHeader';
// import Channeltabs from "@/components/Channeltabs";
// import VideoUploader from "@/components/VideoUploader";
// import ChannelVideos from "@/components/ChannelVideos";
// import { useUser } from "@/lib/AuthContext";

// const Channel = () => {

//     const router = useRouter();
//     const { id } = router.query;

//     const { user } = useUser() as {
//         user: {
//             id: string;
//             name: string;
//             image: string;
//             email?: string;
//             channelname: string;
//             description?: string
//         } | null;
//         loading: boolean;
//         logout: () => Promise<void>;
//         handlegooglesignin: () => Promise<void>;
//     };

//     // const user: any = {
//     //     id: '1',
//     //     name: 'Bhawana Bisht',
//     //     email: 'bhawana1205bisht1802@gmail.com',
//     //     image: 'https://i.pravatar.cc/150?img=5',
//     // };

//     try {
//         let channel;

//         // If this is the user's own channel, use their data
//         if (user && user.id === id) {
//             channel = {
//                 id: user.id,
//                 name: user.channelname || user.name,
//                 email: user.email,
//                 image: user.image,
//                 description: user.description || 'Welcome to my channel!',
//                 joinedOn: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
//             };
//         } else {
//             // Default channel data for other channels
//             channel = {
//                 id: id,
//                 name: 'Tech Channel',
//                 email: 'bbisht@gmail.com',
//                 image: 'https://i.pravatar.cc/150?img=5',
//                 description: 'Welcome to our channel where we share tutorials on various technologies. Subscribe to our chnanel to stay updated.',
//                 joinedOn: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
//             };
//         }

//         if (!channel) {
//             return <div>Channel Not Found</div>
//         }


//         const ChannelVideo = [
//             {
//                 id: "1",
//                 videotitle: "Learn React in 30 Minutes",
//                 filename: "react-tutorial.mp4",
//                 filetype: "video/mp4",
//                 filepath: "/videos/v.mp4",
//                 filesize: "120MB",
//                 videochannel: "Code Academy",
//                 like: 12500,
//                 Dislike: 500,
//                 views: 245000,
//                 uploader: "John Doe",
//                 createdAt: "2025-04-20T10:30:00Z"
//             },
//             {
//                 id: "2",
//                 videotitle: "Next.js Full Course 2025",
//                 filename: "nextjs-course.mp4",
//                 filetype: "video/mp4",
//                 filepath: "/videos/v.mp4",
//                 filesize: "350MB",
//                 videochannel: "Dev Simplified",
//                 like: 45200,
//                 Dislike: 1200,
//                 views: 780000,
//                 uploader: "Sarah Lee",
//                 createdAt: "2025-04-18T08:15:00Z"
//             },
//         ];

//         return (
//             <div className="px-4 md:px-8 py-6 space-y-8 overflow-hidden">

//                         {/* Channel Header */}
//                         <section className="bg-white rounded-3xl shadow-sm overflow-hidden">
//                             <ChannelHeader channel={channel} user={user} />
//                         </section>

//                         {/* Tabs */}
//                         <section className="sticky top-16 z-20 bg-gray-50 py-2">
//                             <Channeltabs />
//                         </section>

//                         {/* Upload Section */}
//                         <section className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
//                             <VideoUploader
//                                 channelId={id}
//                                 channelName={channel.name}
//                             />
//                         </section>

//                         {/* Videos Section */}
//                         <section className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <h2 className="text-2xl font-bold text-gray-900">
//                                     Videos
//                                 </h2>

//                                 <p className="text-sm text-gray-500">
//                                     {ChannelVideo?.length || 0} videos
//                                 </p>
//                             </div>

//                             <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
//                                 <ChannelVideos video={ChannelVideo} />
//                             </div>
//                         </section>
//             </div>
//         );
//     } catch (error) {
//         console.error("Error is :", error)
//     }
// }
// export default Channel;




















"use client";

import React from "react";
import { useRouter } from "next/router";

import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import VideoUploader from "@/components/VideoUploader";
import ChannelVideos from "@/components/ChannelVideos";

import { useUser } from "@/lib/AuthContext";

const Channel = () => {
    const router = useRouter();
    const { id } = router.query;

    const { user } = useUser() as {
        user: {
            id: string;
            name: string;
            image: string;
            email?: string;
            channelname?: string;
            description?: string;
        } | null;

        loading: boolean;
        logout: () => Promise<void>;
        handlegooglesignin: () => Promise<void>;
    };

    // Wait until router is ready
    if (!router.isReady) {
        return <div>Loading...</div>;
    }

    let channel;

    // USER CHANNEL
    if (user && user.id === String(id)) {
        channel = {
            id: user.id,
            name: user.channelname || user.name,
            email: user.email,
            image: user.image,
            description:
                user.description || "Welcome to my channel!",
            joinedOn: new Date(
                Date.now() - 365 * 24 * 60 * 60 * 1000
            ).toLocaleDateString(),
        };
    } else {
        // OTHER CHANNEL
        channel = {
            id: String(id),
            name: "Tech Channel",
            email: "bbisht@gmail.com",
            image: "https://i.pravatar.cc/150?img=5",
            description:
                "Welcome to our channel where we share tutorials on various technologies.",
            joinedOn: new Date(
                Date.now() - 365 * 24 * 60 * 60 * 1000
            ).toLocaleDateString(),
        };
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
            dislike: 500,
            views: 245000,
            uploader: "John Doe",
            createdAt: "2025-04-20T10:30:00Z",
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
            dislike: 1200,
            views: 780000,
            uploader: "Sarah Lee",
            createdAt: "2025-04-18T08:15:00Z",
        },
    ];

    return (
        <div className="px-4 md:px-8 py-6 space-y-8 overflow-hidden bg-gray-50 min-h-screen">

            {/* Channel Header */}
            <section className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <ChannelHeader channel={channel} user={user} />
            </section>

            {/* Tabs */}
            <section className="sticky top-16 z-20 bg-gray-50 py-2">
                <Channeltabs />
            </section>

            {/* Upload Section */}
            <section className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                <VideoUploader
                    channelId={String(id)}
                    channelName={channel.name}
                />
            </section>

            {/* Videos */}
            <section className="space-y-4">

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Videos
                    </h2>

                    <p className="text-sm text-gray-500">
                        {ChannelVideo.length} videos
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                    <ChannelVideos video={ChannelVideo} />
                </div>

            </section>
        </div>
    );
};

export default Channel;