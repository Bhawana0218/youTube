'use client'

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { BellIcon, Menu, Mic, Search, User, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ChannelDialog from './ChannelDialog';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/AuthContext';

const Header = () => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

const { user, loading, logout, handlegooglesignin } = useUser() as {
  user: {
    id: string;
    name: string;
    image: string;
    email?: string;
  } | null;
  loading: boolean;
  logout: () => Promise<void>;
  handlegooglesignin: () => Promise<void>;
};

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChannel, setHasChannel] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  

  const handleSearch = (e: React.ChangeEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);

    }
  }

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  }

if (!mounted) return null;

  return (
    <header className="flex items-center px-4 py-2 bg-white shadow-sm sticky top-0 z-50">

      {/* LEFT */}
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="w-6 h-6" />
        </Button>

        <Link href="/" className="flex items-center gap-1">
          <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-sm">▶</span>
          </div>

          <p className="text-lg font-semibold tracking-tight">YouTube</p>
          <span className="text-xs text-gray-500 ml-1">IN</span>
        </Link>
      </div>

      {/* CENTER (IMPORTANT FIX) */}
      <form onSubmit={handleSearch} className="flex flex-1 justify-center">
        <div className="flex items-center w-full max-w-xl">

          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search"
              onKeyPress={handleKeypress}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-gray-400"
            />

            <button className="px-4 border border-l-0 border-gray-300 rounded-r-full bg-gray-100 hover:bg-gray-200">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <Button variant="ghost" size="icon" className="ml-3 rounded-full">
            <Mic className="h-5 w-5" />
          </Button>

        </div>
      </form>

      {/* RIGHT (FIXED TO FAR RIGHT) */}
      <div className="flex items-center gap-3 ml-auto shrink-0">

        {user ? (
          <>
            <Button variant="ghost" size="icon" className="rounded-full">
              <VideoIcon className="w-6 h-6" />
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full">
              <BellIcon className="w-6 h-6" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer w-8 h-8">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56" forceMount>
                {hasChannel ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/channel/${user.id}`}>Your Channel</Link>
                  </DropdownMenuItem>
                ) : (
                  <div className="px-2 py-1.5">
                    <Button
                      className="w-full"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Create Channel
                    </Button>
                  </div>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/history">History</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/liked">Liked Videos</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/watch-later">Watch Later</Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button variant="outline" className="rounded-full px-4 flex items-center gap-2" onClick={handlegooglesignin}>
            <User className="w-4 h-4" />
            Sign In
          </Button>
        )}

      </div>

      <ChannelDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode="create"
      />
    </header>


  );
}

export default Header;