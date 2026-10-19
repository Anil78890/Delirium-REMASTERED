import type { Category } from "../../../types/menu.types";

interface CategoryNavigationProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryNavigation({
    categories,
    selectedCategoryId,
    onCategorySelect,
}: CategoryNavigationProps) {
    const activeCategories = categories.filter(
        (category) => category.isActive,
    );

    return (
        <nav
            className="menu-category-nav"
            aria-label="Menu categories"
        >
            <button
                type="button"
                className={`menu-category-nav__button ${
                    selectedCategoryId === null
                        ? "menu-category-nav__button--active"
                        : ""
                }`}
                onClick={() => onCategorySelect(null)}
                aria-pressed={selectedCategoryId === null}
            >
                All
            </button>

            {activeCategories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    className={`menu-category-nav__button ${
                        selectedCategoryId === category.id
                            ? "menu-category-nav__button--active"
                            : ""
                    }`}
                    onClick={() => onCategorySelect(category.id)}
                    aria-pressed={selectedCategoryId === category.id}
                >
                    {category.name}
                </button>
            ))}
        </nav>
    );
}