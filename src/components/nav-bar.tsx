import { hasPermission } from "@/lib/has-permission";
import { useAccountStore } from "@/store/account.store";
import { iconMap, menuPermissions } from "@/types/permission.type";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LazyImage } from "./ui/image";

const NavbarItem = ({ link, label, icon }: { link: string, label: string, icon: React.ReactNode }) => {
    return (
        <Link
            to={link}
            activeProps={{
                className: "bg-emerald-500/10 text-emerald-500 shadow-none border-r-4 border-emerald-500 rounded-r-none"
            }}
            className="group flex items-center gap-3 px-4 py-3 mx-4 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
            <span className="transition-colors group-hover:text-emerald-500">
                {icon}
            </span>
            <p className="font-medium text-sm capitalize tracking-wide">{label}</p>
        </Link>
    )
}

export default function Navbar() {
    const { t } = useTranslation();
    const user = useAccountStore((s) => s.user);

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[#121214] border-r border-white/5 transition-transform duration-300 -translate-x-80 xl:translate-x-0 flex flex-col">
            <div className="h-24 flex items-center justify-center border-b border-white/5 shrink-0">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                        <span className="text-xl font-black">B</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white tracking-tight leading-none">
                            BOOK<span className="text-emerald-500">LIB</span>
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                            Management
                        </span>
                    </div>
                </Link>
            </div>

            {/* Close button - Giữ nguyên */}
            <button className="absolute right-4 top-4 p-2 text-gray-400 hover:bg-white/5 rounded-lg xl:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Menu Items - Dùng flex-1 để tự giãn, overflow-y-auto để cuộn */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
                {menuPermissions.map((group) => {
                    const visibleItems = group.items.filter(item =>
                        hasPermission(user, item.permission)
                    );

                    if (visibleItems.length === 0) return null;

                    return (
                        <ul key={group.group} className="mb-6 flex flex-col gap-1">
                            <li className="mx-8 mt-4 mb-2">
                                <p className="text-[11px] font-bold uppercase tracking-[2px] text-gray-600">
                                    {t(group.group)}
                                </p>
                            </li>
                            {visibleItems.map((item) => {
                                const Icon = iconMap[item.icon];
                                return (
                                    <li key={item.path}>
                                        <NavbarItem
                                            link={item.path}
                                            label={t(item.label)}
                                            icon={Icon ? <Icon size={20} /> : null}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    );
                })}
            </div>

            {/* Footer - Cố định ở dưới cùng, dùng shrink-0 để không bị co lại */}
            <div className="shrink-0 p-6 border-t border-white/5 bg-[#121214]">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Hệ quản trị</p>
                    <p className="text-xs text-emerald-500 font-bold mt-1">v1.0.0 Emerald Edition</p>
                </div>
            </div>
        </aside>
    )
}