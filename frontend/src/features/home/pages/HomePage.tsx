import { useEffect, useState } from "react";

import {
    getCategories,
    getMenuItems,
} from "../../../api/menu.api";

import type {
    Category,
    MenuItem,
} from "../../../types/menu.types";

import { HeroSection } from "../components/HeroSection";
import { FeaturedSection } from "../components/FeaturedSection";
import { AboutSection } from "../components/AboutSection";
import { CategoryShowcase } from "../../menu/components/CategoryShowcase";
import { PopularCravingsSection } from "../components/PopularCravingsSection";
import { FinalCtaSection } from "../components/FinalCtaSection";

export function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadFeaturedItems() {
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

                setError("Failed to load homepage content");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadFeaturedItems();

        return () => {
            isMounted = false;
        };
    }, []);

    const featuredCategory = categories.find(
        (category) =>
            category.name === "THE WAFFLE PARADOX" &&
            category.isActive,
    );

    const featuredItem =
        menuItems.find(
            (menuItem) =>
                menuItem.categoryId === featuredCategory?.id &&
                menuItem.isActive &&
                menuItem.isAvailable &&
                menuItem.imageUrl,
        ) ?? null;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <HeroSection />

            <FeaturedSection
                menuItem={featuredItem}
            />

            <AboutSection />

            <CategoryShowcase
                categories={categories}
            />

            <PopularCravingsSection
                menuItems={menuItems}
            />

            <FinalCtaSection />
        </div>
    );
}