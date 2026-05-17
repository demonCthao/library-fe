
import { useAccountStore } from "@/store/account.store";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AvatarDropdownMenu from "./avatar-dropdown";
import { SelectApp } from "./select-app";

export function Header() {
  const { t, i18n } = useTranslation();
  const user = useAccountStore((s) => {
    return s.user;
  });
  const [language, setLanguage] = useState<string>("en")

  const handleChangeLangue = (lang: string) => {
    setLanguage(lang)
    i18n.changeLanguage(lang);
  }

  useEffect(() => {
    const defaultLanguage = () => {
      if (user) {
        console.log("🚀 ~ defaultLanguage ~ user:", user)
        setLanguage(user.lang)
      }
    }

    defaultLanguage()
  }, [user])


  return (
    <nav className="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <nav aria-label="breadcrumb" className="w-max">
            <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
              <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
                <a href="#/dashboard">
                </a>
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/user-page"
            className="rounded-lg px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-white/10"
          >
            {t("gotoUserPage")}
          </Link>
          <div className="w-40">
            <SelectApp placeholder={t("chooseLanguage")}
              className="gb-white data-[placeholder]:text-white text-sm "
              options={[{ value: "vi", label: "Tiếng Việt" }, { value: "en", label: "English" }]}
              onValueChange={handleChangeLangue}
              value={language}
            />
          </div>
          <AvatarDropdownMenu />
        </div>
      </div>
    </nav>
  )
}
