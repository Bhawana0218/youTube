'use client'

import Category from "@/components/Category-tabs";
import VideoGrid from "@/components/Videogrid";
import { Suspense } from "react";


export default function App() {
  return (

    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      
      <Category />
      <Suspense fallback={<div>Loading Videos...</div>}>
        <VideoGrid />
      </Suspense>
    </div>
  );
}

