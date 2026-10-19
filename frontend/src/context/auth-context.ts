import { createContext } from "react";

import type { User } from "../types/auth.types";

export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextValue | undefined>(undefined);