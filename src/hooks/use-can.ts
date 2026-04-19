import { hasPermission } from "@/lib/has-permission";
import { useAccountStore } from "@/store/account.store";
import { Permission } from "@/types/permission.type";

export const useCan = (permissions: Permission[]) => {
  const user = useAccountStore((s) => s.user);

  return hasPermission(user, permissions);
};