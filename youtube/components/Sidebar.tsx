'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Home, Compass, PlaySquare, History, ThumbsUp, Clock} from 'lucide-react';
import { Button } from './ui/button';
import ChannelDialog from './ChannelDialog';
import { useUser } from '@/lib/AuthContext';

const Sidebar = () => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { user } = useUser() as {
    user: {
      id: string;
      name: string;
      image: string;
      email?: string;
      channelname: string;
    } | null;
    loading: boolean;
    logout: () => Promise<void>;
    handlegooglesignin: () => Promise<void>;
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <aside className="h-full bg-white px-2 py-4">

      <nav className="flex flex-col gap-1">

        {/* ITEM */}
        <Link href="/" className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Home</span>
        </Link>

        <Link href="/explore" className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Compass className="w-5 h-5" />
          <span className="text-sm">Explore</span>
        </Link>

        <Link href="/subscriptions" className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <PlaySquare className="w-5 h-5" />
          <span className="text-sm">Subscriptions</span>
        </Link>

        {/* Divider */}
        <div className="border-t my-2" />

        <Link href="/history" className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100">
          <History className="w-5 h-5" />
          <span className="text-sm">History</span>
        </Link>

        <Link href="/liked" className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100">
          <ThumbsUp className="w-5 h-5" />
          <span className="text-sm">Liked videos</span>
        </Link>

        <Link href="/watch-later" className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100">
          <Clock className="w-5 h-5" />
          <span className="text-sm">Watch later</span>
        </Link>

        {user?.channelname ? (
          <Link href={`/channel/${user.id}`} className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100">
            <span className="text-sm">Your Channel</span>
          </Link>
        ) : (
          <div className='px-2 py-1.5'>
            <Button className='w-full' variant="outline" size='sm'
              onClick={() => setIsDialogOpen(true)}>Create Channel</Button>
          </div>
        )}

      </nav>
      <ChannelDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} mode="create" />
    </aside>
  );
}

export default Sidebar;