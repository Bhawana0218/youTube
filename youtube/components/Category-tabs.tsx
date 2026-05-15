'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';

const Category = () => {

    const categories = [
        "All",
        "Music",
        "Gaming",
        "Live",
        "News",
        "Sports",
        "Learning",
        "Podcasts",
        "Movies",
        "Technology",
        "Programming",
        "Bikes",
        "Anime",
        "Trailers",
        "DIY",
        "Art",
        "Photography",
    ];

    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="w-full border-b bg-white sticky top-0 z-20">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 md:px-0 py-3 mb-6">

                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant="ghost"
                        onClick={() => setActiveCategory(cat)}
                        className={`
                    whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-200
                    ${activeCategory === cat
                                ? "bg-black text-white hover:text-white hover:bg-black"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }
                `}
                    >
                        {cat}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default Category;