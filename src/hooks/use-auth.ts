import { JwtPayload } from "@/components/avatar-dropdown";
import { createContext, useContext } from "react";

interface AuthContextType {
  user: JwtPayload | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);