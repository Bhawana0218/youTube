
// 'use client'

// import '@/app/globals.css';
// import { formatDistanceToNow } from 'date-fns';
// import { Clock, MoreVertical, Video, X } from "lucide-react";
// import Link from 'next/link';
// import React, { useEffect, useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
// import { Button } from './ui/button';
// import axiosInstance from '@/lib/axiosinstance';
// import { useUser } from '@/lib/AuthContext';

// interface HistoryItem {
//     id: string;
//     videoid: string;
//     viewer: string;
//     watchedon: string;
//     video: {
//         id: string;
//         videotitle: string;
//         videochannel: string;
//         views: number;
//         createdAt: string;
//     };
// }

// const videos = "./videos/v.mp4";

// const HistoryContent = () => {

//     const [history, setHistory] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const { user } = useUser() as {
//         user: {
//             _id: string;
//             name: string;
//             image: string;
//             email?: string;
//             channelname: string;
//         } | null;
//         loading: boolean;
//         logout: () => Promise<void>;
//         handlegooglesignin: () => Promise<void>;
//     };
//     useEffect(() => {

//     if (!user?._id) {
//         setLoading(false);
//         return;
//     }

//     loadHistory();

// }, [user]);

//    const loadHistory = async () => {

//     try {

//         setLoading(true);

//         const historyData = await axiosInstance.get(
//             `/history/${user?._id}`
//         );

//         setHistory(historyData.data.data);

//     } catch (error) {

//         console.log("Error fetching History", error);

//     } finally {

//         setLoading(false);
//     }
// };

//     const handleRemoveHistory = (historyId: string) => {
//         setHistory((prev) => prev.filter((h) => h._id !== historyId));
//     };

//     if (!user) {
//         return (
//             <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
//                 <Clock className="w-10 h-10 mb-2" />
//                 <h1 className="text-lg font-semibold">Keep Track of what you Watch</h1>
//                 <p className="text-sm">Watch History is not viewable until you sign in.</p>
//             </div>
//         );
//     }

//     if (loading) {
//         return <div className="text-center mt-10">Loading...</div>;
//     }

//     if (history.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
//                 <Clock className="w-10 h-10 mb-2" />
//                 <h1 className="text-lg font-semibold">No Watch History yet</h1>
//                 <p className="text-sm">Videos you watch will appear here.</p>
//             </div>
//         );
//     }

//     return (
//         <>

//             <div className="p-4 md:p-6 space-y-6">

//                 {/* Header */}
//                 <div className="flex items-center justify-between">
//                     <p className="text-lg font-semibold text-gray-800">
//                         Watch History ({history.length})
//                     </p>
//                 </div>

//                 {/* List */}
//                 <div className="space-y-4">
//                     {history.map((item) => (
//                         <div
//                             key={item._id}
//                             className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 transition"
//                         >

//                             {/* Video thumbnail */}
//                             <Link href={`/watch/${item.videoid._id}`} className="shrink-0">
//                                 <div className="w-40 md:w-52 aspect-video overflow-hidden rounded-lg  bg-black group">
//                                     <video
//                                         src={videos}
//                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                                     />
//                                 </div>
//                             </Link>

//                             {/* Content */}
//                             <div className="flex-1 min-w-0">

//                                 <Link href={`/watch/${item.videoid?._id}`}>
//                                     <h3 className="text-base md:text-lg font-medium text-gray-900 truncate hover:text-blue-600">
//                                         {item.videoid?.videotitle}
//                                     </h3>

//                                     <p className="text-sm text-gray-500 mt-1">
//                                         {item.videoid?.views?.toLocaleString()} views •{" "}
//                                         {
//                                             item.videoid?.createdAt
//                                                 ? formatDistanceToNow(new Date(item.videoid.createdAt)) + " ago"
//                                                 : "Recently"
//                                         }
//                                     </p>

//                                     <p className="text-xs text-gray-400 mt-1">
//                                         Watched {formatDistanceToNow(new Date(item.createdAt))} ago
//                                     </p>
//                                 </Link>

//                             </div>

//                             {/* Actions */}
//                             <div className="mr-[50%]">
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
//                                             <MoreVertical className="w-5 h-5 text-black" />
//                                         </Button>
//                                     </DropdownMenuTrigger>

//                                     <DropdownMenuContent className="w-32">
//                                         <DropdownMenuItem
//                                             onClick={() => handleRemoveHistory(item._id)}
//                                             className="text-red-500 cursor-pointer flex items-center gap-2"
//                                         >
//                                             <X className="w-4 h-4" />
//                                             Remove
//                                         </DropdownMenuItem>
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </div>

//                         </div>
//                     ))}
//                 </div>
//             </div>



//         </>
//     );
// };

// export default HistoryContent;

'use client';

import '@/app/globals.css';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MoreVertical, X } from "lucide-react";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import axiosInstance from '@/lib/axiosinstance';
import { useUser } from '@/lib/AuthContext';

interface Video {
  _id: string;
  videotitle: string;
  videochannel?: string;
  views?: number;
  createdAt?: string;
}

interface HistoryItem {
  _id: string;
  videoid: string | Video;
  viewer: string;
  createdAt: string;
}

const HistoryContent = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser() as any;

  const loadHistory = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/history/${user?._id}`);

      // ✅ handle both possible backend shapes
      const data = res.data?.data || res.data || [];

      setHistory(data);

    } catch (error) {
      console.log("Error fetching history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    loadHistory();
  }, [user?._id]);

  const handleRemoveHistory = (historyId: string) => {
    setHistory((prev) => prev.filter((h) => h._id !== historyId));
  };

  // ---------------- UI STATES ----------------

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
        <Clock className="w-10 h-10 mb-2" />
        <h1 className="text-lg font-semibold">Keep Track of what you Watch</h1>
        <p className="text-sm">Watch History is not viewable until you sign in.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-600">
        <Clock className="w-10 h-10 mb-2" />
        <h1 className="text-lg font-semibold">No Watch History yet</h1>
        <p className="text-sm">Videos you watch will appear here.</p>
      </div>
    );
  }

  // ---------------- RENDER ----------------

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-800">
          Watch History ({history.length})
        </p>
      </div>

      <div className="space-y-4">
        {history.map((item) => {

          // ✅ normalize videoid (object OR string)
          const video =
            typeof item.videoid === "object" ? item.videoid : null;

          const videoId =
            typeof item.videoid === "string"
              ? item.videoid
              : item.videoid?._id;

          return (
            <div
              key={item._id}
              className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 transition"
            >

              {/* Thumbnail */}
              <Link href={`/watch/${videoId}`} className="shrink-0">
                <div className="w-40 md:w-52 aspect-video overflow-hidden rounded-lg bg-black">
                  <div className="w-full h-full bg-gray-300" />
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">

                <Link href={`/watch/${videoId}`}>
                  <h3 className="text-base md:text-lg font-medium text-gray-900 truncate hover:text-blue-600">
                    {video?.videotitle || "Untitled Video"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {video?.views?.toLocaleString() || 0} views •{" "}
                    {video?.createdAt
                      ? formatDistanceToNow(new Date(video.createdAt)) + " ago"
                      : "Recently"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Watched {formatDistanceToNow(new Date(item.createdAt))} ago
                  </p>
                </Link>

              </div>

              {/* Actions */}
              <div className="mr-[50%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                      <MoreVertical className="w-5 h-5 text-black" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-32">
                    <DropdownMenuItem
                      onClick={() => handleRemoveHistory(item._id)}
                      className="text-red-500 cursor-pointer flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryContent;