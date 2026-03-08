import { Link } from "@tanstack/react-router";

import {
  BookmarkCheck,
  BookText,
  BookUser,
  Building2,
  Flag,
  FolderClosed,
  Menu,
  SquareFunction,
  User,
  UsersRound,
  X
} from "lucide-react";
import { useState } from "react";
import AvatarDropdownMenu from "./avatar-dropdown";
import { SelectApp } from "./select-app";

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="p-4 flex items-center bg-sky-700 text-white shadow-lg justify-between w-full">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-sky-200 hover:text-black rounded-lg transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="flex gap-3 items-center">
          <div>
            <SelectApp placeholder="Chọn ngôn ngữ" className="data-[placeholder]:text-white" options={[{ value: "vi", label: "Tiếng Việt" }, { value: "en", label: "English" }]} />
          </div>
          <AvatarDropdownMenu />
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white text-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Quản lý thư viện</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-sky-200 cursor-pointer rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/user"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <User size={20} />
            <span className="font-medium">Quản lý người dùng</span>
          </Link>

          <Link
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <SquareFunction size={20} />
            <span className="font-medium">Quản lý tài khoản</span>
          </Link>

          <Link
            to="/book"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <BookText size={20} />
            <span className="font-medium">Quản lý sách</span>
          </Link>

          <Link
            to="/author"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <BookUser size={20} />
            <span className="font-medium">Danh sách tác giả</span>
          </Link>

          <Link
            to="/borrow-records"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <BookmarkCheck size={20} />
            <span className="font-medium">Phiếu mượn</span>
          </Link>

          <Link
            to="/category"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <FolderClosed size={20} />
            <span className="font-medium">Danh sách thể loại</span>
          </Link>

          <Link
            to="/reader"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <UsersRound size={20} />
            <span className="font-medium">Quản lý người đọc</span>
          </Link>

          <Link
            to="/publisher"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <Building2 size={20} />
            <span className="font-medium">Danh sách nhà xuất bản</span>
          </Link>

          <Link
            to="/fine"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sky-200 hover:bg-sky-200 hover:text-sky-500 transition-colors mb-2 text-sky-500",
            }}
          >
            <Flag size={20} />
            <span className="font-medium">Danh sách phiếu phạt</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}
