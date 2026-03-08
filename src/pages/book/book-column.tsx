import { LazyImage } from "@/components/ui/image";
import { Book } from "@/models/book.model";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Book>();

export const bookColumns = [
  columnHelper.accessor("title", {
    header: "Name",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Name",
    },
  }),

  columnHelper.accessor("avatar_path", {
    header: "Avatar",
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
      label: "Avatar",
    },
  }),

  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Description",
    },
  }),

  columnHelper.accessor("language", {
    header: "Language",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Language",
    },
  }),

  columnHelper.accessor("publish_year", {
    header: "Publish Year",
    cell: (info) => info.getValue(),
    sortUndefined: "last",
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Publish Year",
    },
  }),
];