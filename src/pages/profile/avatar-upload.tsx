import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface AvatarUploadProps {
    value?: string
    onChange: (file: File, previewUrl: string) => void
}

const FALLBACK_SRC = "./../src/assets/icons/default_avatar.jpg"

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | undefined>(value)
    console.log("🚀 ~ AvatarUpload ~ preview:", preview)

    // sync khi value từ ngoài thay đổi
    useEffect(() => {
        setPreview(value)
    }, [value])

    // cleanup object URL
    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
        onChange(file, previewUrl)
    }

    const handleError = () => {
        if (preview !== FALLBACK_SRC) {
            setPreview(FALLBACK_SRC)
        }
    }

    // xử lý base URL linh hoạt
    const getSrc = () => {
        if (!preview) return FALLBACK_SRC

        // nếu là blob hoặc absolute URL thì dùng luôn
        if (preview.startsWith("blob:") || preview.startsWith("http")) {
            return preview
        }

        // nếu là path từ backend
        return `http://127.0.0.1:3000${preview}`
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="relative cursor-pointer"
                onClick={() => inputRef.current?.click()}
            >
                <Avatar className="h-28 w-28">
                    <AvatarImage src={getSrc()} onError={handleError} />
                    <AvatarFallback>
                        <img src={FALLBACK_SRC} alt="fallback" />
                    </AvatarFallback>
                </Avatar>

                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md">
                    <Camera className="h-4 w-4" />
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
            >
                Change Avatar
            </Button>

            <input
                type="file"
                accept="image/*"
                hidden
                ref={inputRef}
                onChange={handleFileChange}
            />
        </div>
    )
}