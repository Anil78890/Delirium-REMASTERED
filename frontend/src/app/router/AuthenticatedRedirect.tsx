
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AuthenticatedRedirect() {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo");

    const safeReturnTo =
        returnTo &&
        returnTo.startsWith("/") &&
        !returnTo.startsWith("//") &&
        !returnTo.includes("\\")
            ? returnTo
            : "/";

    return <Navigate to={safeReturnTo} replace />;
}
