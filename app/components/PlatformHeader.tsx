"use client";

import { useState } from "react";
import { Search, Bell, Mail, Menu } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { UserAvatar } from "@/app/components/user-avatar";
import { cn } from "@/lib/utils";

interface PlatformHeaderProps {
  userEmail?: string | null;
}

export default function PlatformHeader({ userEmail }: PlatformHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Handle menu click internally (client-side only)
  const handleMenuClick = () => {
    // Mobile menu functionality can be added here if needed
    // For now, this is a placeholder
    console.log("Menu clicked");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        {/* Left side: Hamburger + Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Hamburger Menu - Mobile Only */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            onClick={handleMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar - Centered with max width */}
          <div className="relative max-w-md w-full mx-auto lg:mx-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 bg-background border-input rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Right side: Notifications and User */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Icons */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted hidden sm:flex"
          >
            <Mail className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background" />
          </Button>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
            <UserAvatar value={userEmail || "user"} size={36} />
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-semibold leading-none">
                {userEmail?.split("@")[0] || "User"}
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-1">
                @{userEmail?.split("@")[0] || "user"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

