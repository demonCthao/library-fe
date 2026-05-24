import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, ShieldAlert } from "lucide-react";

interface ForgotPasswordDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ isOpen, onOpenChange }: ForgotPasswordDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] bg-[#1a1a1c] border-white/10 text-white shadow-2xl rounded-2xl">
                {/* Header Section */}
                <DialogHeader className="flex flex-col items-center justify-center gap-4 pt-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <ShieldAlert className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="space-y-1 text-center">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            Quên mật khẩu?
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm">
                            Vì chính sách bảo mật, vui lòng liên hệ Quản trị viên để được cấp lại mật khẩu mới.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Contact Options */}
                <div className="grid gap-3 py-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 group hover:border-emerald-500/30 transition-all cursor-default">
                        <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Mail size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold">Email Admin</span>
                            <span className="text-sm font-medium text-gray-200">bad123@library.com</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 group hover:border-emerald-500/30 transition-all cursor-default">
                        <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Phone size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold">Hotline kỹ thuật</span>
                            <span className="text-sm font-medium text-gray-200">0900000003</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="ghost"
                        className="w-full text-gray-500 hover:text-white hover:bg-white/5 py-2 text-xs"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng thông báo
                    </Button>
                </div>

                {/* Footer Note */}
                <p className="text-[10px] text-center text-zinc-600 italic">
                    Lưu ý: Bạn sẽ cần cung cấp Mã sinh viên/Nhân viên để xác minh.
                </p>
            </DialogContent>
        </Dialog>
    );
}