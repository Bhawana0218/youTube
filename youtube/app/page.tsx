'use client'

import Category from "@/components/Category-tabs";
import VideoGrid from "@/components/Videogrid";
import { Suspense } from "react";
import { Toaster } from "sonner";


export default function App() {
  return (

    <div className="min-h-screen bg-white text-black">
      <Toaster />
      <Category />
      <Suspense fallback={<div>Loading Videos...</div>}>
        <VideoGrid />
      </Suspense>
    </div>
  );
}

