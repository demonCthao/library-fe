import { Search } from 'lucide-react';
import React from 'react'
import { Button } from "@/components/ui/button";
import { useNavigate } from '@tanstack/react-router';
import { useFetch } from '@/hooks/useFetch';
import { Category } from '@/models/category.model';
import Loading from './loading';
import { useAccountStore } from '@/store/account.store';
import _ from 'lodash';
import AvatarDropdownMenu from './avatar-dropdown';
import { LazyImage } from './ui/image';

interface ILayoutProps {
    children: React.ReactNode
}

export default function UserLayout({ children }: ILayoutProps) {
    const navigate = useNavigate();
    const account = useAccountStore();

    const { data, isLoading, error, refetch } = useFetch<Category[]>({
        url: "category-books",
        key: ["category-books"],
    });

    const gotoLogin = () => {
        navigate({
            to: "/login",
            replace: true
        });
    }

    const gotoHome = () => {
        navigate({
            to: "/user-page",
            replace: true
        });
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="bg-[rgb(18 18 20)] text-white">
            <div className="sticky top-0 z-50 opacity-50 bg-black">
                <header className="w-full bg-black text-white">
                    <div className="mx-auto flex h-16 items-center justify-between px-6">
                        {/* LEFT */}
                        <div className="flex items-center gap-10">
                            {/* Logo */}
                            <div className="text-4xl cursor-pointer font-white text-emerald-400" onClick={gotoHome}>
                                <LazyImage className="w-[100%] h-[40px]" src="../../src/assets/images/image.png" />
                            </div>

                            {/* Menu */}
                            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
                                {data?.map((item) => (
                                    <a
                                        key={item.id}
                                        href="#"
                                        className="transition hover:text-emerald-400 whitespace-nowrap"
                                    >
                                        {item?.name}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <button className="hover:text-emerald-400 transition">
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Premium */}
                            <Button
                                variant="outline"
                                className="rounded-full border-yellow-500 bg-transparent text-yellow-400 hover:bg-yellow-500 hover:text-black"
                            >
                                Gói cước
                            </Button>

                            {
                                _.isNull(account?.user) ? <>
                                    <Button
                                        variant="secondary"
                                        className="rounded-full bg-zinc-700 hover:bg-zinc-600"
                                    >
                                        Đăng ký
                                    </Button>

                                    <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={gotoLogin}>
                                        Đăng nhập
                                    </Button>
                                </> : <div><AvatarDropdownMenu /></div>
                            }

                        </div>
                    </div>
                </header>
            </div>
            {children}
        </div>


    )
}
