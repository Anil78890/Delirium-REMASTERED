import { Link } from "react-router-dom";

import type { MenuItem } from "../../../types/menu.types";

interface PopularCravingsSectionProps {
    menuItems: MenuItem[];
}

export function PopularCravingsSection({
    menuItems,
}: PopularCravingsSectionProps) {
    const popularItemNames = [
        "The Kunafa Delirium",
        "Crispy Paneer Waffwich",
        "The Kaccha Aam Zinger",
        "Brownie Sundae",
    ];

    const popularItems = popularItemNames
        .map((name) =>
            menuItems.find(
                (menuItem) =>
                    menuItem.name === name &&
                    menuItem.isActive &&
                    menuItem.isAvailable,
            ),
        )
        .filter(
            (menuItem): menuItem is MenuItem =>
                menuItem !== undefined,
        );

    return (
        <section
            className="popular-cravings"
            aria-labelledby="popular-cravings-title"
        >
            <div className="popular-cravings__header">
                <div>
                    <p className="popular-cravings__eyebrow">
                        FROM THE DELIRIUM
                    </p>

                    <h2 id="popular-cravings-title">
                        POPULAR
                        <br />
                        CRAVINGS.
                    </h2>
                </div>

                <Link
                    to="/menu"
                    className="popular-cravings__link"
                >
                    View Full Menu →
                </Link>
            </div>

            <div className="popular-cravings__grid">
                {popularItems.map((menuItem) => (
                    <Link
                        key={menuItem.id}
                        to={`/menu?item=${menuItem.id}`}
                        className="popular-cravings__item"
                    >
                        <div className="popular-cravings__image-wrapper">
                            <img
                                src={menuItem.imageUrl!}
                                alt={menuItem.name}
                                className="popular-cravings__image"
                            />
                        </div>

                        <div className="popular-cravings__item-info">
                            <h3>{menuItem.name}</h3>

                            <span>
                                ₹{menuItem.priceInPaise / 100}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}