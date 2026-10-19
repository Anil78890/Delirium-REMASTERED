export type UserRole =
| "CUSTOMER"
| "ADMIN";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}