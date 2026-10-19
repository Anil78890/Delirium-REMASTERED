import { Link } from "react-router-dom";

import type { Category } from "../../../types/menu.types";

interface CategoryShowcaseProps {
    categories: Category[];
}

export function CategoryShowcase({
    categories,
}: CategoryShowcaseProps) {
    const activeCategories = categories
        .filter((category) => category.isActive)
        .slice(0, 6);

    return (
        <section
            className="category-showcase"
            aria-labelledby="category-showcase-title"
        >
            <div className="category-showcase__header">
                <p className="category-showcase__eyebrow">
                    EXPLORE THE STATES
                </p>

                <h2 id="category-showcase-title">
                    FIND YOUR
                    <br />
                    DELIRIUM.
                </h2>

                <p>
                    Sweet, crispy, frozen, fizzy.
                    Pick a direction and see where it takes you.
                </p>
            </div>

            <div className="category-showcase__grid">
                {activeCategories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/menu?category=${category.id}`}
                        className="category-showcase__card"
                    >
                        <span className="category-showcase__number">
                            {String(
                                category.displayOrder,
                            ).padStart(2, "0")}
                        </span>

                        <h3>{category.name}</h3>

                        {category.description && (
                            <p>{category.description}</p>
                        )}

                        <span className="category-showcase__arrow">
                            →
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}