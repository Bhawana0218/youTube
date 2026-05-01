import React, { useState } from "react";
import { Button } from "./ui/button";

const Channeltabs = () => {
    const tabs = [
        { id: "home", label: "Home" },
        { id: "videos", label: "Videos" },
        { id: "shorts", label: "Shorts" },
        { id: "playlists", label: "Playlists" },
        { id: "community", label: "Community" },
        { id: "about", label: "About" },
    ];

    const [activeTab, setActiveTab] = useState("videos");

    return (
        <div className="w-full border-b border-gray-200 bg-white">
            {/* Tabs container */}
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all
                                ${
                                    isActive
                                        ? "bg-black text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
                            `}
                        >
                            {tab.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default Channeltabs;