import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({ channel, user }: any) => {

    const [isSubscribed, setIsSubscribed] = useState(false);

    return (
        <div className="w-full">
            <div className="relative h-32 md:h-48 lg:h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-14 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-white shadow-xl">
                            <AvatarFallback className="text-4xl font-bold bg-gray-200 text-gray-700">
                                {(channel?.channelname || channel?.name || "C").charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">

                            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                                {channel?.channelname || channel?.name || "Channel"}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">
                                    @{(channel?.channelname || channel?.name || "channel").toLowerCase().replace(/\s+/g, "")}
                                </span>
                                <span>•</span>
                                <span>1.2K subscribers</span>
                                <span>•</span>
                                <span>24 videos</span>
                            </div>
                            {channel?.description && (
                                <p className="text-sm md:text-base text-gray-700 max-w-2xl leading-relaxed">
                                    {channel.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pb-2">

                        {user && user.id === channel.id ? (
                            <Button
                                variant="outline"
                                className="rounded-full px-6 h-11 text-sm font-medium shadow-sm"
                            >
                                Customize Channel
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsSubscribed(!isSubscribed)}
                                className={`rounded-full px-6 h-11 text-sm font-medium transition-all ${isSubscribed
                                    ? "bg-gray-200 hover:bg-gray-300 text-black"
                                    : "bg-black hover:bg-gray-800 text-white"
                                    }`}
                            >
                                {isSubscribed ? "Subscribed" : "Subscribe"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChannelHeader;