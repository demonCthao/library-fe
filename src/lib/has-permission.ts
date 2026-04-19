import { JwtPayload } from "@/components/avatar-dropdown";
import { Permission, rolePermissions } from "@/types/permission.type";
import _ from "lodash";

export const hasPermission = (
  user: JwtPayload | null,
  required: Permission[]
) => {
  if (!user) return false;

  const permissions = rolePermissions[user.role];

  if (permissions.includes("*")) return true;

  return required.some((p) => permissions.includes(p));
};