import type { MenuItem } from "../../../types/menu.types";

interface MenuItemCardProps {
    menuItem: MenuItem;
    onAdd: (menuItem: MenuItem) => void;
    isSelected?: boolean;
}

export function MenuItemCard({
    menuItem,
    onAdd,
    isSelected,
}: MenuItemCardProps) {
    const isUnavailable =
        !menuItem.isActive || !menuItem.isAvailable;

    const price = menuItem.priceInPaise / 100;

    return (
        <article
            id={`menu-item-${menuItem.id}`}
            className={[
                "menu-item-card",
                isUnavailable &&
                    "menu-item-card--unavailable",
                isSelected &&
                    "menu-item-card--selected",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="menu-item-card__image-wrapper">
                {menuItem.imageUrl ? (
                    <img
                        src={menuItem.imageUrl}
                        alt={menuItem.name}
                        className="menu-item-card__image"
                    />
                ) : (
                    <div className="menu-item-card__image-placeholder">
                        <span>DELIRIUM</span>
                    </div>
                )}

                {isUnavailable && (
                    <span className="menu-item-card__status">
                        Unavailable
                    </span>
                )}
            </div>

            <div className="menu-item-card__content">
                <div className="menu-item-card__top">
                    <h3>{menuItem.name}</h3>

                    <span className="menu-item-card__price">
                        ₹{price}
                    </span>
                </div>

                {menuItem.description && (
                    <p className="menu-item-card__description">
                        {menuItem.description}
                    </p>
                )}

                <button
                    type="button"
                    className="menu-item-card__add"
                    disabled={isUnavailable}
                    onClick={() => {
                        onAdd(menuItem);
                    }}
                >
                    {isUnavailable
                        ? "Unavailable"
                        : "Add to Cart"}
                </button>
            </div>
        </article>
    );
}