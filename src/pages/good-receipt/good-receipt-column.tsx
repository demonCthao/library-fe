import { GoodsReceipt } from "@/models/good-receipt.model";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<GoodsReceipt>();

export const goodsReceiptColumns = [
  columnHelper.accessor("code", {
    header: "receiptCode",
    cell: (info) => (
      <div className="max-w-[120px] truncate font-medium text-blue-600" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
    sortUndefined: "last",
    sortDescFirst: true,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "receiptCode",
      headerClassName: "text-left",
    },
  }),

  columnHelper.accessor("publisher_id", {
    header: "publisherId",
    cell: (info) => <div className="text-left">{info.getValue()}</div>,
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "publisherId",
      headerClassName: "text-left",
    },
  }),

  columnHelper.accessor("created_by", {
    header: "createdBy",
    cell: (info) => <div className="text-left">{info.getValue()}</div>,
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "createdBy",
      headerClassName: "text-left",
    },
  }),

  /* ========================================================
   * CỘT SỐ LƯỢNG: Đã đồng bộ căn giữa (center) toàn bộ
   * ======================================================== */
  columnHelper.accessor("goods_receipt_details", {
    id: "totalQuantity",
    header: "totalQuantity",
    cell: ({ getValue }) => {
      const details = getValue() || [];
      const totalQty = details.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      return <div className="flex justify-center text-center font-semibold w-full">{totalQty}</div>;
    },
    sortUndefined: "last",
    enableColumnFilter: false,
    meta: {
      label: "totalQuantity",
      headerClassName: "text-center", // Tiêu đề ra giữa
      className: "text-center",       // Nội dung ô ra giữa
    },
  }),

  /* ========================================================
   * CỘT TỔNG TIỀN: Đã đồng bộ căn phải (right) toàn bộ
   * ======================================================== */
  columnHelper.accessor("goods_receipt_details", {
    id: "totalAmount",
    header: "totalAmount",
    cell: ({ getValue }) => {
      const details = getValue() || [];
      const totalAmount = details.reduce(
        (sum, item) => sum + Number(item.quantity || 0) * Number(item.import_price || 0),
        0
      );
      return (
        <div className="flex justify-end text-right font-semibold text-green-600 w-full">
          {totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      );
    },
    sortUndefined: "last",
    enableColumnFilter: false,
    meta: {
      label: "totalAmount",
      headerClassName: "text-right", // Tiêu đề ra bên phải
      className: "text-right",       // Nội dung ô ra bên phải
    },
  }),

  columnHelper.accessor("created_at", {
    header: "createdAt",
    cell: (info) => {
      const dateVal = info.getValue();
      if (!dateVal) return "---";
      return new Date(dateVal).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    sortUndefined: "last",
    sortDescFirst: true,
    footer: (info) => info.column.id,
    enableColumnFilter: false,
    meta: {
      label: "createdAt",
      headerClassName: "text-center",
      className: "text-center",
    },
  }),
];