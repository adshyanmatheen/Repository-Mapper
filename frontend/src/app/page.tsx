'use client';

import Hero from '@/components/hero';
import Repos from '@/components/repos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useHotkeys } from 'react-hotkeys-hook';

function getAbbreviation(name: string): string {
  const words = name.split(' ');
  const initials = words.map((word) => word[0]).join('');
  return initials.toUpperCase();
}

export default function Home() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  useHotkeys('shift+q', handleSignOut);

  if (!session?.user) {
    return (
      <div className="flex">
        <Hero />
      </div>
    );
  }

  const userName = session.user.name ?? '';
  const userImage = session.user.image ?? undefined;
  const userInitials = getAbbreviation(userName);

  return (
    <div>
      <div className="grid grid-cols-1">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row justify-between py-4 items-center mt-4">
            <h2 className="text-xl font-semibold"> Welcome {userName}!</h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={userImage} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="hover:bg-red-300"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                    <DropdownMenuShortcut>⇧Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <Repos />
    </div>
  );
}
