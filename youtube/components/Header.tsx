'use client'

import React, { useEffect, useRef, useState } from 'react';
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
      channelname: string;
    } | null;
    loading: boolean;
    logout: () => Promise<void>;
    handlegooglesignin: () => Promise<void>;
  };

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  }

  const handleVoiceSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleRecord = () => {
    if (!user) {
      handlegooglesignin();
      return;
    }
    router.push("/record");
  };

  const handleNotifications = () => {
    router.push("/notifications");
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">

      {/* LEFT */}
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleMenuToggle}>
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

      <form onSubmit={handleSearch} className="flex flex-1 justify-center w-full min-w-0">
        <div className="flex items-center w-full max-w-xl">

          <div className="flex w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              onKeyPress={handleKeypress}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-gray-400"
            />

            <button className="px-4 border border-l-0 border-gray-300 hover:text-white rounded-r-full bg-gray-100 hover:bg-gray-200">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <Button variant="ghost" size="icon" className="ml-3 rounded-full" onClick={handleVoiceSearch}>
            <Mic className="h-5 w-5" />
          </Button>

        </div>
      </form>

      <div className="flex items-center gap-3 ml-auto shrink-0">

        {user ? (
          <>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleRecord}>
              <VideoIcon className="w-6 h-6" />
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleNotifications}>
              <BellIcon className="w-6 h-6" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer w-8 h-8">
                  <AvatarImage
                    src={user?.image || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=150&q=80"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56" forceMount>
                {user?.channelname ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/channel/${user?.id}`}>Your Channel</Link>
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

                <DropdownMenuItem asChild>
                  <Link href="/downloads">Downloads</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/premium">Premium</Link>
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

      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-white border-t border-slate-200 shadow-lg md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            <Link href="/" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/explore" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              Explore
            </Link>
            <Link href="/subscriptions" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              Subscriptions
            </Link>
            <Link href="/history" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              History
            </Link>
            <Link href="/liked" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              Liked
            </Link>
            <Link href="/watch-later" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              Watch Later
            </Link>
            <Link href="/downloads" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              Downloads
            </Link>
            <Link href="/premium" className="rounded-xl px-3 py-3 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              Premium
            </Link>
          </nav>
        </div>
      )}

      <ChannelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode="create"
      />
      </div>
    </header>


  );
}

export default Header;
