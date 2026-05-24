import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

interface IOrderSuccessPopupProps {
    open: boolean;
    onClose: () => void;
}

export const OrderSuccessPopup = ({ open, onClose }: IOrderSuccessPopupProps) => {
const navigate = useNavigate();

    const gotoDashboard = () => {
        navigate({
            to: "/user-page",
        });
    }

    const gotoOrder = () => {
        navigate({
            to: "/user-page-order",
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] bg-[#141414] border-gray-800 text-white rounded-2xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="hidden">Thanh toán thành công</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6">
                    {/* Icon tích xanh với hiệu ứng vòng tròn */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="relative bg-[#1a1a1a] rounded-full p-1 border border-green-500/30">
                            <CheckCircle2 className="w-20 h-20 text-[#00c853] stroke-[1.5px]" />
                        </div>
                    </div>

                    {/* Nội dung thông báo */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
                            Đặt hàng thành công!
                        </h2>
                        <p className="text-gray-400 text-sm px-6">
                            Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đang được xử lý và vui lòng đến cửa hàng để lấy hàng do hiện tại số lượng đơn hàng đang quá tải.
                        </p>
                    </div>

                    {/* Nút hành động */}
                    <div className="mt-8 w-full space-y-3">
                        <Button
                            onClick={() => {
                                onClose()
                                gotoDashboard()
                            }}
                            className="w-full bg-[#00c853] hover:bg-[#00a344] text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-green-900/20"
                        >
                            Tiếp tục mua sắm
                        </Button>
                        <Button
                            variant="link"
                            className="w-full text-gray-500 hover:text-white text-xs"
                            onClick={() => {
                                onClose();
                                gotoOrder();
                            }}
                        >
                            Xem lịch sử đơn hàng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};