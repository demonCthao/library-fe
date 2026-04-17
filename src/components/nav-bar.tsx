import { Link } from "@tanstack/react-router";
import {
    BookmarkCheck,
    BookText,
    BookUser,
    Building2,
    Flag,
    FolderClosed,
    House,
    User,
    UserLock,
    UsersRound
} from "lucide-react";
import { useTranslation } from "react-i18next";

const NavbarItem = ({ link, label, icon }: { link: string, label: string, icon: React.ReactNode }) => {
    return <Link to={link}
        
        activeProps={{
            className:
                "align-middle select-none font-sans font-bold cursor-pointer text-left transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] w-full flex items-center gap-2 px-2 capitalize"
        }}
    >
        <button className="align-middle select-none font-sans font-bold cursor-pointer text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 w-full flex items-center gap-2 px-2 capitalize" type="button">
            {icon}
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">{label}</p>
        </button>
    </Link>
}

export default function Navbar() {
    const { t } = useTranslation();

    return (
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
            <aside className="bg-white shadow-sm -translate-x-80 fixed inset-0 z-50 mt-4 w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100">
                <div className="relative">
                    <a className="py-6 px-8 text-center" href="#/">
                        <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">{t("bookManagementSystem")}</h6>
                    </a>
                    <button className="align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden" type="button">
                        <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true" className="h-5 w-5 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </span>
                    </button>
                </div>
                <div className="m-4 max-h-[calc(100vh-100px)] overflow-y-auto">
                    <ul className="mb-4 flex flex-col gap-1">
                        <li>
                            <NavbarItem link="/dashboard" label={t("dashboard")} icon={<House size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/user" label={t("userManager")} icon={<User size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/book" label={t("bookManagement")} icon={<BookText size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/author" label={t("authorList")} icon={<BookUser size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/borrow-records" label={t("borrowingRecord")} icon={<BookmarkCheck size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/category" label={t("categoryList")} icon={<FolderClosed size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/reader" label={t("patronManagement")} icon={<UsersRound size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/publisher" label={t("publisherList")} icon={<Building2 size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/fine" label={t("penaltyList")} icon={<Flag size={20} />} />
                        </li>
                    </ul>
                    <ul className="mb-4 flex flex-col gap-1">
                        <li className="mx-3.5 mt-4 mb-2">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-black uppercase opacity-75">{t("systemAdministration")}</p>
                        </li>
                        <li>
                            <NavbarItem link="/fine" label={t("accessControl")} icon={<UserLock size={20} />} />
                        </li>
                        <li>
                            <NavbarItem link="/banking" label={t("bankAccount")} icon={<UserLock size={20} />} />
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
