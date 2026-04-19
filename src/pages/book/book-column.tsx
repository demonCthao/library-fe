import { LazyImage } from "@/components/ui/image";
import { Book } from "@/models/book.model";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Book>();

export const bookColumns = [
  columnHelper.accessor("title", {
    header: "name",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "name",
    },
  }),

  columnHelper.accessor("avatar_path", {
    header: "avatar",
    cell: ({ row }) => {
      const avatar = row.original.avatar_path;

      if (!avatar) {
        return (
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-sm">
            {row.original.title?.charAt(0)}
          </div>
        );
      }

      return (
        <LazyImage
          src={`http://127.0.0.1:3000${avatar}`}
          alt={row.original.title}
          className="w-10 h-10 object-cover"
        />
      );
    },
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    enableColumnFilter: false,
    meta: {
      label: "avatar",
    },
  }),

  columnHelper.accessor("description", {
    header: "description",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "description",
    },
  }),

  columnHelper.accessor("language", {
    header: "language",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "language",
    },
  }),

  columnHelper.accessor("publish_year", {
    header: "publishYear",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "publishYear",
    },
  }),
];