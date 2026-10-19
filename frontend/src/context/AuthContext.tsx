import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    getMe,
    logout as logoutApi,
    refreshAccessToken,
} from "../api/auth.api";

import {
    clearAccessToken,
    setAccessToken,
} from "../lib/auth/token-store";

import {
    AuthContext,
    type AuthContextValue,
} from "./auth-context";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<AuthContextValue["user"]>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function bootstrapAuth() {
            try {
                const accessToken = await refreshAccessToken();

                if (!isMounted) {
                    return;
                }

                setAccessToken(accessToken);

                const currentUser = await getMe();

                if (!isMounted) {
                    return;
                }

                setUser(currentUser);
            } catch {
                if (!isMounted) {
                    return;
                }

                clearAccessToken();
                setUser(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void bootstrapAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    async function logout() {
        try {
            await logoutApi();
        } finally {
            clearAccessToken();
            setUser(null);
        }
    }

    const value: AuthContextValue = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}