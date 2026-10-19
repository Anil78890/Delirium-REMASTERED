
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { AuthProvider } from "../../context/AuthContext";

import { CustomerLayout } from "../../layouts/CustomerLayout";
import { AdminLayout } from "../../layouts/AdminLayout";

import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { AuthenticatedRedirect } from "./AuthenticatedRedirect";

import { HomePage } from "../../features/home/pages/HomePage";
import { MenuPage } from "../../features/menu/pages/MenuPage";
import { CartPage } from "../../features/cart/pages/CartPage";
import { CheckoutPage } from "../../features/checkout/pages/CheckoutPage";
import { OrdersPage } from "../../features/order/pages/OrderPage";
import { ScrollToTop } from "../../components/ScrollToTop";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";

function LoginPage() {


    const location = useLocation();

const returnTo =
    typeof location.state?.from === "string"
        ? location.state.from
        : "/";


    function handleGoogleLogin() {
        const apiBaseUrl =
            import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

       window.location.href =
    `${apiBaseUrl}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Welcome back</h2>
                <p>Sign in to continue to your account.</p>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

function AdminDashboardPage() {
    return <h2>Admin Dashboard</h2>;
}

function NotFoundPage() {
    return <h2>Page not found</h2>;
}

export function AppRouter() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <Routes>
                    {/* Standalone login page — outside CustomerLayout */}
                    <Route element={<PublicOnlyRoute />}>
                        <Route
                            path="/login"
                            element={<LoginPage />}
                        />
                    </Route>

                    <Route element={<CustomerLayout />}>
                        <Route
                            path="/"
                            element={<HomePage />}
                        />

                        <Route
                            path="/menu"
                            element={<MenuPage />}
                        />

                        <Route element={<ProtectedRoute />}>
                            <Route
                                path="/orders"
                                element={<OrdersPage />}
                            />

                            <Route
                                path="/cart"
                                element={<CartPage />}
                            />

                            <Route
                                path="/checkout"
                                element={<CheckoutPage />}
                            />

                            <Route
    path="/profile"
    element={<ProfilePage />}
/>
                        </Route>
                    </Route>

                    <Route
                        path="/auth/callback"
                        element={<AuthenticatedRedirect />}
                    />

                    <Route element={<AdminRoute />}>
                        <Route
                            path="/admin"
                            element={<AdminLayout />}
                        >
                            <Route
                                index
                                element={<AdminDashboardPage />}
                            />
                        </Route>
                    </Route>

                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
