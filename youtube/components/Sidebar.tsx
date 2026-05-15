'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  Home,
  Compass,
  PlaySquare,
  History,
  ThumbsUp,
  Clock,
} from 'lucide-react';
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

  const menuItems = [
    {
      name: 'Home',
      icon: Home,
      href: '/',
    },
    {
      name: 'Explore',
      icon: Compass,
      href: '/explore',
    },
    {
      name: 'Subscriptions',
      icon: PlaySquare,
      href: '/subscriptions',
    },
  ];

  const libraryItems = [
    {
      name: 'History',
      icon: History,
      href: '/history',
    },
    {
      name: 'Liked videos',
      icon: ThumbsUp,
      href: '/liked',
    },
    {
      name: 'Watch later',
      icon: Clock,
      href: '/watch-later',
    },
  ];

  return (
    <aside className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-gray-200 bg-white px-3 py-5">

      <nav className="flex flex-col gap-6">

        {/* MAIN MENU */}
        <div className="space-y-1">

          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={index}
                href={item.href}
                className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-100"
              >
                <Icon className="h-5 w-5 text-gray-700 transition-colors duration-200 group-hover:text-black" />

                <span className="text-sm font-medium text-gray-800">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-200" />

        {/* LIBRARY */}
        <div>

          <h3 className="px-4 pb-2 text-sm font-semibold text-gray-500">
            Library
          </h3>

          <div className="space-y-1">

            {libraryItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-100"
                >
                  <Icon className="h-5 w-5 text-gray-700 transition-colors duration-200 group-hover:text-black" />

                  <span className="text-sm font-medium text-gray-800">
                    {item.name}
                  </span>
                </Link>
              );
            })}

          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-200" />

        {/* CHANNEL SECTION */}
        <div className="px-2">

          {user?.channelname ? (
            <Link
              href={`/channel/${user.id}`}
              className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100"
            >
              Your Channel
            </Link>
          ) : (
            <Button
              className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-800 shadow-none transition-all duration-200 hover:bg-gray-100"
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
            >
              Create Channel
            </Button>
          )}

        </div>

      </nav>

      <ChannelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode="create"
      />

    </aside>
  );
}

export default Sidebar;