import { ROLE } from "@/constants/role.constants";

import {
  BookText,
  BookUser,
  BookmarkCheck,
  Building2,
  Flag,
  FolderClosed,
  House,
  ShoppingBag,
  User,
  UserLock,
  UsersRound,
  PackagePlus,
} from "lucide-react";

export const PERMISSIONS = {
  dashboard: ["dashboard:view"],
  users: ["users:view", "users:mutation", "users:delete", "users:export"],
  books: ["books:view", "books:mutation", "books:delete", "books:export"],
  authors: ["authors:view", "authors:mutation", "authors:delete", "authors:export"],
  borrows: ["borrows:view", "borrows:mutation", "borrows:delete", "borrows:export"],
  categories: ["categories:view", "categories:mutation", "categories:delete", "categories:export"],
  readers: ["readers:view", "readers:mutation", "readers:delete", "readers:export"],
  publishers: ["publishers:view", "publishers:mutation", "publishers:delete", "publishers:export"],
  fines: ["fines:view", "fines:mutation", "fines:delete", "fines:export"],
  bank: ["bank:view", "bank:mutation", "bank:delete", "bank:export"],
  extra: ["borrow-detail:view", "borrow-records:view"],
  purchases: ["purchases:view", "purchases:mutation", "purchases:delete", "purchases:export"],
  goods_receipts: ["goods_receipts:view", "goods_receipts:mutation", "goods_receipts:delete", "goods_receipts:export"],
} as const;

export const VIEW = {
  dashboard: PERMISSIONS.dashboard[0],
  users: PERMISSIONS.users[0],
  books: PERMISSIONS.books[0],
  authors: PERMISSIONS.authors[0],
  borrows: PERMISSIONS.borrows[0],
  categories: PERMISSIONS.categories[0],
  readers: PERMISSIONS.readers[0],
  publishers: PERMISSIONS.publishers[0],
  fines: PERMISSIONS.fines[0],
  bank: PERMISSIONS.bank[0],
  purchases: PERMISSIONS.purchases[0],
  goods_receipts: PERMISSIONS.goods_receipts[0],
};

export const MUTATION = {
  users: PERMISSIONS.users[1],
  books: PERMISSIONS.books[1],
  authors: PERMISSIONS.authors[1],
  borrows: PERMISSIONS.borrows[1],
  categories: PERMISSIONS.categories[1],
  readers: PERMISSIONS.readers[1],
  publishers: PERMISSIONS.publishers[1],
  fines: PERMISSIONS.fines[1],
  bank: PERMISSIONS.bank[1],
  purchases: PERMISSIONS.purchases[1],
  goods_receipts: PERMISSIONS.goods_receipts[1],
};

export const DELETE = {
  users: PERMISSIONS.users[2],
  books: PERMISSIONS.books[2],
  authors: PERMISSIONS.authors[2],
  borrows: PERMISSIONS.borrows[2],
  categories: PERMISSIONS.categories[2],
  readers: PERMISSIONS.readers[2],
  publishers: PERMISSIONS.publishers[2],
  fines: PERMISSIONS.fines[2],
  bank: PERMISSIONS.bank[2],
  purchases: PERMISSIONS.purchases[2],
  goods_receipts: PERMISSIONS.goods_receipts[2],
};

export const EXPORT = {
  users: PERMISSIONS.users[3],
  books: PERMISSIONS.books[3],
  authors: PERMISSIONS.authors[3],
  borrows: PERMISSIONS.borrows[3],
  categories: PERMISSIONS.categories[3],
  readers: PERMISSIONS.readers[3],
  publishers: PERMISSIONS.publishers[3],
  fines: PERMISSIONS.fines[3],
  bank: PERMISSIONS.bank[3],
  purchases: PERMISSIONS.purchases[3],
  goods_receipts: PERMISSIONS.goods_receipts[3],
};

export const iconMap = {
  dashboard: House,
  user: User,
  books: BookText,
  authors: BookUser,
  borrows: BookmarkCheck,
  categories: FolderClosed,
  readers: UsersRound,
  publishers: Building2,
  fines: Flag,
  accessControl: UserLock,
  banking: UserLock,
  ShoppingBag: ShoppingBag,
  goodsReceipts: PackagePlus,
} as const;

export type IconKey = keyof typeof iconMap;

export const menuPermissions = [
  {
    group: "main",
    items: [
      { label: "dashboard", path: "/dashboard", icon: "dashboard", permission: [VIEW.dashboard] },
      { label: "userManager", path: "/user", icon: "user", permission: [VIEW.users] },
      { label: "bookManagement", path: "/book", icon: "books", permission: [VIEW.books] },
      { label: "authorList", path: "/author", icon: "authors", permission: [VIEW.authors] },
      { label: "borrowingRecord", path: "/borrow-records", icon: "borrows", permission: [VIEW.borrows] },
      { label: "categoryList", path: "/category", icon: "categories", permission: [VIEW.categories] },
      { label: "patronManagement", path: "/reader", icon: "readers", permission: [VIEW.readers] },
      { label: "publisherList", path: "/publisher", icon: "publishers", permission: [VIEW.publishers] },
      { label: "purchaseOrderList", path: "/purchase-order", icon: "ShoppingBag", permission: [VIEW.purchases] },
      { label: "goodsReceiptList", path: "/good-receipt", icon: "goodsReceipts", permission: [VIEW.goods_receipts] },
    ],
  },
  {
    group: "systemAdministration",
    items: [
      { label: "bankAccount", path: "/banking", icon: "banking", permission: [VIEW.bank] },
    ],
  },
] as const;

export type Permission =
  typeof PERMISSIONS[keyof typeof PERMISSIONS][number];

type RolePermissions = Record<ROLE, readonly (Permission | "*")[]>;

export const rolePermissions: RolePermissions = {
  admin: ["*"],

  librarian: [
    VIEW.users,
    VIEW.authors,
    VIEW.categories,
    VIEW.readers,
    VIEW.publishers,
    VIEW.fines,
    VIEW.books,
    VIEW.purchases,
  ],

  user: []
};

export const isAdminRoute = (pathname: string) => {
  return menuPermissions.some((group) =>
    group.items.some((item) => {
      if (pathname === item.path) return true;
      
      return pathname.startsWith(`${item.path}/`);
    })
  );
};