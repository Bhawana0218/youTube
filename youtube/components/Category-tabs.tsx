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
        <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
            {categories.map((cat) => (
                <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    onClick={() => setActiveCategory(cat)}
                    className='whitespace-nowrap'>
                    {cat}
                </Button>
            ))}
        </div>
    );
}

export default Category;