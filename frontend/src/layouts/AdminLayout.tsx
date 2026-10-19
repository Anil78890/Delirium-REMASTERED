import { Outlet } from "react-router-dom";

export function AdminLayout() {
    return (
        <div>
            <header>
                <h1>Delirium Admin</h1>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}