'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import { Home, Compass, PlaySquare, History, ThumbsUp, Clock, User } from 'lucide-react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { Button } from './ui/button';
import ChannelDialog from './ChannelDialog';

const Sidebar = () => {

   const user: any = {
        id: '1',
        name: 'Bhawana Bisht',
        email: 'bhawana1205bisht1802@gmail.com',
        image: 'https://i.pravatar.cc/150?img=5',
    }
    
        const [hasChannel, setHasChannel] = useState(false);
        const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <aside className="w-56 h-screen bg-white border-r fixed top-0 left-0 pt-16 px-2">

      <nav className="flex flex-col">

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

         {hasChannel ? (<DropdownMenuItem asChild>
              <Link href={`/channel/${user.id}`}>Your Channel</Link>
            </DropdownMenuItem>) :(
              <div className='px-2 py-1.5'>
                <Button  className='w-full' variant="outline" size='sm'
                onClick={() => setIsDialogOpen(true)}>Create Channel</Button>
              </div>
            )}

      </nav>
      <ChannelDialog isOpen={isDialogOpen} onClose={()=> setIsDialogOpen(false)} mode="create"/>
    </aside>
  );
}

export default Sidebar;