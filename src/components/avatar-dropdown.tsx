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
import { useAccountStore } from "@/store/account.store";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { User, Key, LogOut, Mail, LayoutDashboard } from "lucide-react"; // Import thêm LayoutDashboard
import { Role } from "@/types/role.type";
import { ROLE } from "@/constants/role.constants"; // Giả định bạn có file constant này

export default function AvatarDropdownMenu() {
  const navigate = useNavigate();
  const userStore = useAccountStore();
  const { t } = useTranslation();

  // Kiểm tra quyền Admin/Librarian
  const isAdminOrLibrarian =
    userStore.user?.role === ROLE.ADMIN ||
    userStore.user?.role === ROLE.LIBRARIAN;

  const handleLogout = () => {
    localStorage.clear();
    userStore.setUser(null);

    if (userStore.user?.role === ROLE.USER) {
      navigate({ to: "/user-page" });
    } else {
      navigate({ to: "/login" });
    }
  }

  return (
    <div className="flex gap-3 items-center">
      <div className="hidden md:block text-right">
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Xin chào</p>
        <p className="text-sm font-semibold text-gray-200">{userStore.user?.fullName}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-70 transition duration-300 blur-[2px]"></div>
            <Avatar className="relative border-2 border-[#0a0a0a] h-10 w-10">
              <AvatarImage
                alt="avatar"
                src={`http://127.0.0.1:3000${userStore.user?.avatarPath}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-800 text-emerald-500 font-bold">
                {userStore.user?.fullName?.substring(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 bg-[#141414] border-gray-800 text-gray-200 rounded-xl shadow-2xl p-2"
        >
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold leading-none text-white">{userStore.user?.fullName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail size={12} className="text-gray-500" />
                <p className="text-xs text-gray-500 truncate">{userStore.user?.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-gray-800/50" />

          <DropdownMenuGroup className="space-y-1 py-1">
            {/* NÚT QUẢN LÝ: Chỉ hiện nếu là Admin hoặc Librarian */}
            {isAdminOrLibrarian && (
              <DropdownMenuItem
                className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer bg-emerald-500/10 text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-300 border border-emerald-500/20"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                <LayoutDashboard size={16} />
                <span className="font-bold">Trang quản trị</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-400"
              onClick={() => navigate({ to: `/profile/${userStore.user?.userId}` })}
            >
              <User size={16} />
              <span>{t("profile")}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-400"
              onClick={() => navigate({ to: `/change-pass/${userStore.user?.userId}` })}
            >
              <Key size={16} />
              <span>{t("changePassword")}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-800/50" />

          <DropdownMenuItem
            className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer mt-1 text-pink-500 focus:bg-pink-500/10 focus:text-pink-500"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="font-medium">{t("logOut")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}