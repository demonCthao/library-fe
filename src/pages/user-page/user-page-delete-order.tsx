import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface IDeleteOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    orderCode: string;
}

export const DeleteOrderDialog = ({
    open,
    onOpenChange,
    onConfirm,
    orderCode,
}: IDeleteOrderDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-[#141414] border-gray-800 text-white rounded-2xl shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0 flex flex-col items-center">
                    {/* Icon cảnh báo màu đỏ */}
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-red-500/20">
                        <AlertTriangle className="w-10 h-10 text-red-500 stroke-[1.5px]" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-gray-100">
                        Xóa đơn hàng này?
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-center text-sm mt-2">
                        Bạn có chắc chắn muốn xóa đơn hàng <span className="text-red-400 font-mono font-bold">{orderCode}</span>?
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-8">
                    <DialogFooter className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl h-11 transition-all"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm();
                                onOpenChange(false);
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-11 transition-all shadow-lg shadow-red-900/20"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xác nhận xóa
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};