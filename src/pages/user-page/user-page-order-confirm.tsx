import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, ShoppingCart } from "lucide-react";

interface IOrderConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    totalAmount: number;
    totalItems: number;
}

export const OrderConfirmDialog = ({
    open,
    onOpenChange,
    onConfirm,
    totalAmount,
    totalItems,
}: IOrderConfirmDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#141414] border-gray-800 text-white rounded-2xl shadow-2xl p-0 overflow-hidden">
                {/* Header với màu nền nhấn nhẹ */}
                <DialogHeader className="p-6 pb-0 flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-yellow-500/20">
                        <AlertCircle className="w-10 h-10 text-yellow-500 stroke-[1.5px]" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-100">
                        Xác nhận đơn hàng
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-center text-sm mt-2">
                        Vui lòng kiểm tra lại danh sách sản phẩm và tổng tiền trước khi tiến hành thanh toán.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    {/* Box tóm tắt thông tin đơn hàng */}
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> Số lượng sản phẩm:
                            </span>
                            <span className="font-semibold text-gray-200">{totalItems} món</span>
                        </div>

                        <div className="h-[1px] bg-gray-800 w-full" />

                        <div className="flex justify-between items-end">
                            <span className="text-gray-500 text-sm italic">Tổng thanh toán:</span>
                            <span className="text-2xl font-bold text-[#e91e63]">
                                {totalAmount.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    </div>

                    <p className="text-[11px] text-gray-500 text-center italic">
                        * Sau khi xác nhận, đơn hàng sẽ được chuyển đến bộ phận xử lý ngay lập tức.
                    </p>
                </div>

                {/* Footer chứa các nút hành động */}
                <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl h-12 transition-all"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-[#00c853] hover:bg-[#00a344] text-white font-bold rounded-xl h-12 transition-all shadow-lg shadow-green-900/20"
                    >
                        Xác nhận mua
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};