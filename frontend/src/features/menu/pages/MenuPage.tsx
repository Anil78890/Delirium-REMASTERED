import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    getCategories,
    getMenuItems,
} from "../../../api/menu.api";

import type {
    Category,
    MenuItem,
} from "../../../types/menu.types";

import { CategoryNavigation } from "../components/CategoryNavigation";
import { MenuItemList } from "../components/MenuItemList";

import { useCartContext } from "../../../context/CartContext";
import { useAuth } from "../../../hooks/useAuth";

export function MenuPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const [searchParams, setSearchParams] =
        useSearchParams();

    const selectedCategoryId =
        searchParams.get("category");

    const selectedItemId =
        searchParams.get("item");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] =
        useState<string | null>(null);

    const { addItem } = useCartContext();
    const navigate = useNavigate();

const {
    isAuthenticated,
    isLoading: isAuthLoading,
} = useAuth();


async function handleAddToCart(menuItem: MenuItem) {
    if (isAuthLoading) {
        return;
    }

    if (!isAuthenticated) {
        navigate("/login", {
            state: {
                from: `/menu?item=${menuItem.id}`,
            },
        });

        return;
    }

    try {
        await addItem(menuItem);
    } catch (error) {
        console.error("Failed to add item to cart:", error);
    }
}
    useEffect(() => {
        let isMounted = true;

        async function loadMenu() {
            try {
                setIsLoading(true);
                setError(null);

                const [
                    loadedCategories,
                    loadedMenuItems,
                ] = await Promise.all([
                    getCategories(),
                    getMenuItems(),
                ]);

                if (!isMounted) {
                    return;
                }

                setCategories(loadedCategories);
                setMenuItems(loadedMenuItems);
            } catch {
                if (!isMounted) {
                    return;
                }

                setError("Failed to load menu");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadMenu();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredMenuItems = useMemo(() => {
        if (selectedCategoryId === null) {
            return menuItems;
        }

        return menuItems.filter(
            (menuItem) =>
                menuItem.categoryId === selectedCategoryId,
        );
    }, [menuItems, selectedCategoryId]);

    const selectedMenuItem = useMemo(() => {
        if (selectedItemId === null) {
            return null;
        }

        return (
            menuItems.find(
                (menuItem) =>
                    menuItem.id === selectedItemId,
            ) ?? null
        );
    }, [menuItems, selectedItemId]);

    useEffect(() => {
        if (!selectedMenuItem) {
            return;
        }

        const element = document.getElementById(
            `menu-item-${selectedMenuItem.id}`,
        );

        element?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [selectedMenuItem]);

    if (isLoading) {
        return <div>Loading menu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <section
                id="menu"
                className="menu-section"
            >
                <div className="menu-section__header">
                    <p className="menu-section__eyebrow">
                        EXPLORE THE DELIRIUM
                    </p>

                    <h2>THE MENU</h2>

                    <p>
                        Pick your craving. Enter your state
                        of delicious confusion.
                    </p>
                </div>

                <CategoryNavigation
                    categories={categories}
                    selectedCategoryId={
                        selectedCategoryId
                    }
                    onCategorySelect={(categoryId) => {
                        if (categoryId === null) {
                            setSearchParams({});
                            return;
                        }

                        setSearchParams({
                            category: categoryId,
                        });
                    }}
                />

                <MenuItemList
                    menuItems={filteredMenuItems}
                    onAdd={handleAddToCart}
                    selectedItemId={selectedItemId}
                />
            </section>
        </div>
    );
}