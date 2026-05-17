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
import { PiggyBank } from "lucide-react"
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
        if (avatarPreview) {
          setAvatarPreview({
            ...avatarPreview,
            src: user?.avatar_path
          })
        } else {
          setAvatarPreview({
            file: undefined,
            src: user?.avatar_path
          })
        }
      }
  }, [user]);

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div>{error.message}</div>
  }

  const handleChange = (key: keyof User, value: any) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleSave = () => {
    const formValue = form;
    delete formValue?.accounts
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify(formValue)
    )

    if (avatarPreview?.file) {
      formData.append("image", avatarPreview.file)
    }

    mutate(formData)
  }

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-coverbg-center">
        <div className="absolute inset-0 w-full bg-gray-900/75"></div>
      </div>
      <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md mx-3 -mt-36 lg:mx-4 border border-blue-gray-100">
        <div className="px-4 pt-4 pb-5">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <AvatarUpload
                value={avatarPreview?.src}
                onChange={(file, preview) => {
                  setAvatarPreview({
                    file: file,
                    src: preview
                  })
                  handleChange("avatar_path", preview)
                }}
              />
              <div>
                <h5 className="block antialiased tracking-normal font-sans text-xl font-bold leading-snug text-blue-gray-900 mb-1">{form?.full_name}</h5>
                <div className="block antialiased font-sans text-md leading-normal font-semibold text-blue-gray-600 flex items-center">
                  <p className="">{form?.role} /</p>
                  <Badge className={cn("px-3 py-1 text-sm ml-2", form?.status === "active" ? "bg-green-600" : "")}>
                    {form?.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-cols-3">
            <div>
              <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-2">{t("platformSettings")}</h6>
              <div className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="antialiased font-sans mb-2 block text-xs font-semibold uppercase text-blue-gray-500">{t("user")}</p>
                    <div className="flex flex-col gap-1">
                      <div>
                        <div>
                          <label className="text-sm font-medium">{t("userId")}</label>
                          <Input value={form?.id} disabled />
                        </div>

                      </div>
                      <div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            value={form?.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                          />
                        </div>

                      </div>
                      <div>
                        <div>
                          <label className="text-sm font-medium">{t("phone")}</label>
                          <Input
                            value={form?.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="antialiased font-sans mb-2 block text-xs font-semibold uppercase text-blue-gray-500">{t("account")}</p>
                    <div className="flex flex-col gap-1">
                      <div>
                        <div>
                          <label className="text-sm font-medium">{t("account")}</label>
                          <Input
                            value={form?.accounts?.username}
                            disabled
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">{t("language")}</label>
                        <SelectApp
                          value={form?.lang}
                          options={[
                            { label: "Vietnamese", value: "vi" },
                            { label: "English", value: "en" },
                          ]}
                          onValueChange={(value) =>
                            handleChange("lang", value)
                          }
                        />
                      </div>
                      <div>
                        <div>
                          <label className="text-sm font-medium">{t("createdAt")}</label>
                          <Input
                            value={formatDate(form?.accounts?.created_at)}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="antialiased font-sans mb-4 block text-xs font-semibold uppercase text-blue-gray-500">application</p>
                  <div className="flex flex-col gap-6">
                    <div className="inline-flex items-center">
                      <Switch id="airplane-moder" className="cursor-pointe" />
                      <label className="select-none cursor-pointer mt-px ml-3 mb-0 text-sm font-normal text-blue-gray-500">Dark mode</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex">
            <div className="ml-auto">
              <Button
                size="lg"
                className="px-10 shadow-md hover:shadow-lg transition"
                onClick={handleSave}
              >
                {t("saveChanges")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-blue-gray-600 mt-10">
        <footer className="py-2">
          <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
            <p className="block antialiased font-sans text-sm leading-normal font-normal text-inherit flex gap-1">© 2026, made with
              <PiggyBank size={18} /> by
              <a href="#" target="_blank" className="transition-colors hover:text-blue-500 font-bold"> Bui Cong Dat</a> for a better web.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}