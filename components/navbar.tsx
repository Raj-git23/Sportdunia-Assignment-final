"use client"
import React, {useEffect, useState} from "react";
import SearchComponent from "./search";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, LogOut, Settings, UserCircle, SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

const Navbar = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  // Handle localStorage access safely after component mounts
  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        setUser(JSON.parse(userString));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
    }
  }, []);

  const isAdmin = user?.role || false;
  
  console.log(user);
  console.log(isAdmin);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  return (
    <>
      <div className="w-full bg-gray-50 flex items-center justify-between max-w-8xl px-2 sm:px-8 lg:px-12 py-2 sticky top-0 z-30">
        <p
          className="font-black text-lg sm:text-2xl md:text-4xl cursor-pointer"
          onClick={() => router.push("/")}
        >
          NewsHUB
        </p>

        <div className="flex gap-4 items-center justify-end">
          <SearchIcon
            className="flex md:hidden"
            onClick={() => setIsSearchOpen((prev) => !prev)}
          />
          <div className="hidden md:flex">
            {" "}
            <SearchComponent />{" "}
          </div>

          {!user ? (
            <Button onClick={() => router.push("/login")}>Sign In</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="w-8 h-8 lg:h-10 lg:w-10">
                    <AvatarImage src={user?.img} alt={user?.name} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user?.name ? (
                        getInitials(user.name)
                      ) : (
                        <UserCircle className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        Admin
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {isSearchOpen && (
        <div className="flex items-center py-2 bg-gray-50 justify-between gap-4 px-4 w-full mx-auto">
          <SearchComponent />
          <X onClick={() => setIsSearchOpen(prev => !prev)} />
        </div>
      )}
    </>
  );
};

export default Navbar;