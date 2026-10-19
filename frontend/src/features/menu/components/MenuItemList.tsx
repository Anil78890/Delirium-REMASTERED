import type { MenuItem } from "../../../types/menu.types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuItemListProps {
    menuItems: MenuItem[];
    onAdd: (menuItem: MenuItem) => void;
    selectedItemId?: string | null;
}

export function MenuItemList({
    menuItems,
    onAdd,
    selectedItemId,
}: MenuItemListProps) {
   if (menuItems.length === 0) {
    return (
        <div className="menu-item-list__empty">
            <span>NOTHING HERE YET</span>
            <p>No items available in this category.</p>
        </div>
    );
}

    return (
        <div className="menu-item-list">
            {menuItems.map((menuItem) => (
                <MenuItemCard
                    key={menuItem.id}
                    menuItem={menuItem}
                    onAdd={onAdd}
                    isSelected={
                        menuItem.id === selectedItemId
                    }
                />
            ))}
        </div>
    );
}