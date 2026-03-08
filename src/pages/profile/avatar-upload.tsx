"use client"

import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface AvatarUploadProps {
    value?: string
    onChange: (file: File, previewUrl: string) => void
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        onChange(file, previewUrl)
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="relative cursor-pointer"
                onClick={() => inputRef.current?.click()}
            >
                <Avatar className="h-28 w-28">
                    <AvatarImage src={value} />
                    <AvatarFallback>U</AvatarFallback>
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