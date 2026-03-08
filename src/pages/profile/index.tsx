import Loading from "@/components/loading"
import { SelectApp } from "@/components/select-app"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { User } from "@/models/user.model"
import { useParams } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { AvatarUpload } from "./avatar-upload"

export default function ProfilePage() {
  const { id } = useParams({ from: "/profile/$id" });

  const { data: user, isLoading, error } = useFetch<User>({
    url: `users/profile/${id}`,
    key: ["user-detail", id],
  });

  const [form, setForm] = useState<User | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>()

  useEffect(() => {
    if (user) {
      setForm(user)
      setAvatarPreview(user?.avatar_path)
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
    console.log("Submit:", form)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">

      <div className="flex flex-col items-center space-y-4">
        <AvatarUpload
          value={avatarPreview}
          onChange={(file, preview) => {
            setAvatarPreview(preview)
            handleChange("avatar_path", preview)
          }}
        />

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {form?.full_name}
          </h2>
          <Badge className={cn("px-3 py-1 text-sm", form?.status === "active"? "bg-green-600": "")}>
            {form?.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg">
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <div>
              <label className="text-sm font-medium">User ID</label>
              <Input value={form?.id} disabled />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={form?.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={form?.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />
            </div>

          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg">
              Role & Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <div>
              <label className="text-sm font-medium">Role</label>
              <SelectApp
                value={form?.role}
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "Librarian", value: "librarian" },
                ]}
                onValueChange={(value) =>
                  handleChange("role", value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Language</label>
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

          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" size="lg">
          Cancel
        </Button>
        <Button
          size="lg"
          className="px-10 shadow-md hover:shadow-lg transition"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

    </div>
  )
}