import Loading from "@/components/loading"
import { SelectApp } from "@/components/select-app"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useFetch } from "@/hooks/useFetch"
import { cn, formatDate } from "@/lib/utils"
import { User } from "@/models/user.model"
import { useParams } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { AvatarUpload } from "./avatar-upload"
import { PiggyBank, User as UserIcon, Shield, Settings, Globe } from "lucide-react"
import { useMutationRequest } from "@/hooks/useMutation"
import { useNotificationStore } from "@/store/notification.store"
import { useTranslation } from "react-i18next"

export default function ProfilePage() {
  const { id } = useParams({ from: "/profile/$id" });
  const { t } = useTranslation();
  const notification = useNotificationStore();
  const [form, setForm] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<{
    file: File | undefined,
    src: string | undefined
  } | undefined>();

  const { data: user, isLoading, error } = useFetch<User>({
    url: `users/profile/${id}`,
    key: ["user-detail", id],
  });

  const { mutate } = useMutationRequest({
    key: ["update-profile"],
    url: `users/${id}`, method: "put", options: {
      onSuccess: () => {
        notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
      },
      onError: () => {
        notification.updateState({ message: t("updateFail"), type: "error", open: true });
      }
    }
  });

  useEffect(() => {
    if (user) {
      setForm(user)
      setAvatarPreview({
        file: undefined,
        src: user?.avatar_path
      })
    }
  }, [user]);

  if (isLoading) return <Loading />
  if (error) return <div className="text-red-500 p-10 text-center">{error.message}</div>

  const handleChange = (key: keyof User, value: any) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleSave = () => {
    const formValue = { ...form };
    delete formValue.accounts;
    const formData = new FormData();
    formData.append("data", JSON.stringify(formValue));

    if (avatarPreview?.file) {
      formData.append("image", avatarPreview.file);
    }
    mutate(formData);
  }

  return (
    <div className="min-h-full pb-10">
      {/* Banner Section - Tối ưu hóa Gradient */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 to-zinc-900 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/img/background-image.png')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative mx-4 -mt-24 lg:mx-8">
        <div className="rounded-3xl bg-[#1a1a1c] border border-white/5 p-6 shadow-2xl">

          {/* Profile Header Area */}
          <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <AvatarUpload
                  value={avatarPreview?.src}
                  onChange={(file, preview) => {
                    setAvatarPreview({ file: file, src: preview });
                    handleChange("avatar_path", preview);
                  }}
                />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 group-hover:border-emerald-500 transition-colors pointer-events-none"></div>
              </div>

              <div className="text-center md:text-left">
                <h5 className="text-3xl font-bold text-white tracking-tight">{form?.full_name}</h5>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-3">
                  <span className="text-emerald-500 font-semibold text-sm uppercase tracking-widest">{form?.role}</span>
                  <div className="h-4 w-[1px] bg-white/10"></div>
                  <Badge variant="outline" className={cn(
                    "px-4 py-0.5 border-none rounded-full text-xs font-bold",
                    form?.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {form?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              {t("saveChanges")}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2 text-emerald-500">
                <UserIcon size={18} />
                <h6 className="font-bold uppercase tracking-wider text-sm">{t("userInformation")}</h6>
              </div>

              <div className="grid gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t("userId")}</label>
                  <Input value={form?.id} disabled className="bg-white/5 border-white/10 text-gray-400 rounded-xl" />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                  <Input
                    value={form?.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t("phone")}</label>
                  <Input
                    value={form?.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Account & Settings Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2 text-emerald-500">
                <Shield size={18} />
                <h6 className="font-bold uppercase tracking-wider text-sm">{t("accountSettings")}</h6>
              </div>

              <div className="grid gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t("username")}</label>
                  <Input value={form?.accounts?.username} disabled className="bg-white/5 border-white/10 text-gray-400 rounded-xl" />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t("language")}</label>
                  <SelectApp
                    value={form?.lang}
                    options={[
                      { label: "Tiếng Việt", value: "vi" },
                      { label: "English", value: "en" },
                    ]}
                    onValueChange={(value) => handleChange("lang", value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t("createdAt")}</label>
                  <Input value={formatDate(form?.accounts?.created_at)} disabled className="bg-white/5 border-white/10 text-gray-400 rounded-xl" />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4 text-emerald-500">
                  <Settings size={18} />
                  <h6 className="font-bold uppercase tracking-wider text-sm">System Preference</h6>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-white">Dark Mode</span>
                    <span className="text-[10px] text-gray-500 uppercase">Giao diện tối tối ưu cho mắt</span>
                  </div>
                  <Switch checked className="data-[state=checked]:bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 px-8 text-gray-600 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm flex items-center gap-2">
            © 2026, crafted with <PiggyBank size={18} className="text-emerald-500" /> by
            <a href="#" className="text-emerald-500 font-bold hover:underline"> Bui Cong Dat</a>
          </p>
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}