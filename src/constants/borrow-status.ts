export const statusBorrowMap: Record<
    string,
    { label: string; className: string }
> = {
    borrowing: {
        label: "Đang mượn",
        className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    },
    returned: {
        label: "Đã trả",
        className: "bg-green-100 text-green-700 border border-green-200",
    },
    overdue: {
        label: "Quá hạn",
        className: "bg-red-100 text-red-700 border border-red-200",
    },
};