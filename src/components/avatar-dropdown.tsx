import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/account.store";
import { useNavigate } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  exp: number;
  fullName: string;
  userName: string;
  lang: string;
}

export default function AvatarDropdownMenu() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const handleLogout = () => {
    if (userStore.user) {
      localStorage.clear();
      navigate({
        to: "/login",
        replace: true
      });
    }
  }

  const handleGotoProfilePage = () => {
    navigate({
      to: "/profile/"+ userStore?.user?.userId,
      replace: true
    });
  };

  const handleChangePassword = () => {
    navigate({
      to: "/change-pass/"+ userStore.user?.userId,
      replace: true
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      userStore.updateUser(decoded);
    }
  }, [])

  return (
    <div className="flex gap-3 text-[16px] items-center">
      <div className="text-blue-gray-500 font-sans font-bold text-sm">Hi: {userStore.user?.fullName}</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{userStore.user?.email}</DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-gray-300" onClick={handleGotoProfilePage}>Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-300" onClick={handleChangePassword}>Change Password</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem  className="hover:bg-gray-300" variant="destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

  );
}