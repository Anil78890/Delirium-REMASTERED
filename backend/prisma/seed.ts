import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const categories = [
    {
        name: "THE BREWED ILLUSIONS",
        description: "Custom Tea-Topped Mocktails",
        displayOrder: 1,
    },
    {
        name: "THE CRYSTAL MIRAGES",
        description: "Classic Mocktails & Crushers",
        displayOrder: 2,
    },
    {
        name: "THE LIQUID TRANCE",
        description: "Cold Frappes, Shakes & Smoothies",
        displayOrder: 3,
    },
    {
        name: "THE CAFFEINATED & WARM STATES",
        description: "Tea, Coffee & Comfort Cups",
        displayOrder: 4,
    },
    {
        name: "THE SOLID HALLUCINATIONS",
        description: "Savory Waffles & Waffwiches",
        displayOrder: 5,
    },
    {
        name: "THE HANDHELD DELUSIONS",
        description: "Wraps & Rolls",
        displayOrder: 6,
    },
    {
        name: "THE TOASTED CRAVINGS",
        description: "Sandwiches",
        displayOrder: 7,
    },
    {
        name: "THE CRISPY MIRAGES",
        description: "Snacks, Bowls & Skewers",
        displayOrder: 8,
    },
    {
        name: "THE MACRO STATES",
        description: "Warm Bowls",
        displayOrder: 9,
    },
    {
        name: "THE WAFFLE PARADOX",
        description: "Sweet Waffles & Desserts",
        displayOrder: 10,
    },
    {
        name: "THE FROZEN PARADOX",
        description: "Ice Cream & Sundaes",
        displayOrder: 11,
    },
];

const menuItems = [
    // ============================================================
    // THE BREWED ILLUSIONS
    // ============================================================

    {
        categoryName: "THE BREWED ILLUSIONS",
        name: "The Minty Blueberry Awakening",
        description:
            "Sweet blueberry base topped with cooling Mint Green Tea.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE BREWED ILLUSIONS",
        name: "The Hibiscus Watermelon Mirage",
        description:
            "Sweet watermelon crowned with tart Hibiscus Cinnamon Clove Green Tea.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE BREWED ILLUSIONS",
        name: "The Jasmine Apple Illusion",
        description:
            "Crisp green apple balanced by delicate Jasmine Green Tea.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE BREWED ILLUSIONS",
        name: "The Saffron Orange Trance",
        description:
            "Sweet orange crush topped with rich Kashmiri Kahwa Green Tea.",
        priceInPaise: 7900,
    },

    // ============================================================
    // THE CRYSTAL MIRAGES
    // ============================================================

    {
        categoryName: "THE CRYSTAL MIRAGES",
        name: "The Kaccha Aam Zinger",
        description: "Refreshing raw mango based mocktail.",
        priceInPaise: 4900,
    },
    {
        categoryName: "THE CRYSTAL MIRAGES",
        name: "The Blue Ginger Delusion",
        description: "Refreshing blue mocktail with a ginger twist.",
        priceInPaise: 4900,
    },
    {
        categoryName: "THE CRYSTAL MIRAGES",
        name: "The Watermelon Mint Mojito",
        description: "Refreshing watermelon and mint mojito.",
        priceInPaise: 4900,
    },
    {
        categoryName: "THE CRYSTAL MIRAGES",
        name: "The Blueberry Mint Mojito",
        description: "Blueberry mojito with a refreshing mint finish.",
        priceInPaise: 4900,
    },

    // ============================================================
    // THE LIQUID TRANCE
    // ============================================================

    {
        categoryName: "THE LIQUID TRANCE",
        name: "The KitKat Crunch Trance",
        description: "Rich creamy shake blended with KitKat crunch.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE LIQUID TRANCE",
        name: "The Paradox Shake",
        description:
            "Creamy shake available in multiple delicious flavors.",
        priceInPaise: 6900,
    },
    {
        categoryName: "THE LIQUID TRANCE",
        name: "Protein Smoothie Bowl",
        description: "Nutritious and filling protein smoothie bowl.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE LIQUID TRANCE",
        name: "The Vanilla Illusion",
        description: "Smooth and creamy classic vanilla shake.",
        priceInPaise: 6900,
    },

    // ============================================================
    // THE CAFFEINATED & WARM STATES
    // ============================================================

    {
        categoryName: "THE CAFFEINATED & WARM STATES",
        name: "Teabox Wellness Green Tea",
        description: "Choose from 10 signature green tea flavors.",
        priceInPaise: 2900,
    },
    {
        categoryName: "THE CAFFEINATED & WARM STATES",
        name: "The Golden Delirium Latte",
        description: "Rich and creamy signature golden latte.",
        priceInPaise: 5900,
    },
    {
        categoryName: "THE CAFFEINATED & WARM STATES",
        name: "The Boosted Awakening",
        description: "Pure, simple hot espresso shot.",
        priceInPaise: 1900,
    },
    {
        categoryName: "THE CAFFEINATED & WARM STATES",
        name: "The Delusion Hot Chocolate",
        description: "Warm and creamy indulgent hot chocolate.",
        priceInPaise: 4900,
    },

    // ============================================================
    // THE SOLID HALLUCINATIONS
    // ============================================================

    {
        categoryName: "THE SOLID HALLUCINATIONS",
        name: "Crispy Chicken Waffwich",
        description: "Crispy chicken served inside a savory waffle.",
        priceInPaise: 9900,
    },
    {
        categoryName: "THE SOLID HALLUCINATIONS",
        name: "Crispy Paneer Waffwich",
        description: "Crispy paneer served inside a savory waffle.",
        priceInPaise: 9900,
    },
    {
        categoryName: "THE SOLID HALLUCINATIONS",
        name: "Melted Pizza Waffle (Veg)",
        description:
            "Cheesy vegetable pizza toppings on a crispy waffle.",
        priceInPaise: 9900,
    },
    {
        categoryName: "THE SOLID HALLUCINATIONS",
        name: "Melted Pizza Waffle (Chicken Sausage)",
        description:
            "Cheesy pizza waffle topped with chicken sausage.",
        priceInPaise: 10900,
    },

    // ============================================================
    // THE HANDHELD DELUSIONS
    // ============================================================

    {
        categoryName: "THE HANDHELD DELUSIONS",
        name: "Creamy Chicken Wrap",
        description:
            "Creamy chicken filling wrapped in a soft tortilla.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE HANDHELD DELUSIONS",
        name: "Creamy Tikka Chicken Wrap",
        description:
            "Creamy chicken tikka wrapped with fresh ingredients.",
        priceInPaise: 6900,
    },
    {
        categoryName: "THE HANDHELD DELUSIONS",
        name: "Creamy Paneer Wrap",
        description:
            "Creamy paneer filling wrapped in a soft tortilla.",
        priceInPaise: 6900,
    },
    {
        categoryName: "THE HANDHELD DELUSIONS",
        name: "Crunchy Chicken Wrap",
        description:
            "Crunchy chicken with fresh fillings in a soft wrap.",
        priceInPaise: 6900,
    },

    // ============================================================
    // THE TOASTED CRAVINGS
    // ============================================================

    {
        categoryName: "THE TOASTED CRAVINGS",
        name: "Pepper-Mayo Chicken Sandwich",
        description:
            "Chicken sandwich with creamy pepper mayo.",
        priceInPaise: 6900,
    },
    {
        categoryName: "THE TOASTED CRAVINGS",
        name: "Creamy Tikka Chicken Sandwich",
        description:
            "Creamy chicken tikka layered between toasted bread.",
        priceInPaise: 6900,
    },
    {
        categoryName: "THE TOASTED CRAVINGS",
        name: "Cheesy Creamy Chicken Sandwich",
        description:
            "Creamy chicken sandwich loaded with cheese.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE TOASTED CRAVINGS",
        name: "The Fresh Veggie Awakening",
        description:
            "Fresh vegetables and creamy filling in toasted bread.",
        priceInPaise: 4900,
    },

    // ============================================================
    // THE CRISPY MIRAGES
    // ============================================================

    {
        categoryName: "THE CRISPY MIRAGES",
        name: "DELIRIUM'S SIGNATURE FRIES",
        description:
            "Crispy golden fries with your choice of seasoning.",
        priceInPaise: 4900,
    },
    {
        categoryName: "THE CRISPY MIRAGES",
        name: "Loaded Nachos (Veg)",
        description:
            "Crispy nachos loaded with cheesy vegetable toppings.",
        priceInPaise: 6900,
    },
    {
        categoryName: "THE CRISPY MIRAGES",
        name: "Chicken Popcorn",
        description:
            "Bite-sized crispy chicken pieces.",
        priceInPaise: 9900,
    },
    {
        categoryName: "THE CRISPY MIRAGES",
        name: "Paneer Tikka Skewers",
        description:
            "Char-grilled paneer tikka served on skewers.",
        priceInPaise: 3900,
    },

    // ============================================================
    // THE MACRO STATES
    // ============================================================

    {
        categoryName: "THE MACRO STATES",
        name: "Classic Masala Maggi",
        description:
            "Classic masala Maggi noodles.",
        priceInPaise: 3900,
    },
    {
        categoryName: "THE MACRO STATES",
        name: "White Sauce Maggi",
        description:
            "Creamy white sauce Maggi noodles.",
        priceInPaise: 5900,
    },
    {
        categoryName: "THE MACRO STATES",
        name: "Red Sauce Maggi",
        description:
            "Tangy red sauce Maggi noodles.",
        priceInPaise: 4900,
    },
    {
        categoryName: "THE MACRO STATES",
        name: "Korean Spiced Maggi",
        description:
            "Spicy Korean-style Maggi noodles.",
        priceInPaise: 4900,
    },

    // ============================================================
    // THE WAFFLE PARADOX
    // ============================================================

    {
        categoryName: "THE WAFFLE PARADOX",
        name: "The Kunafa Delirium",
        description:
            "Sweet waffle inspired by rich kunafa flavors.",
        priceInPaise: 11900,
    },
    {
        categoryName: "THE WAFFLE PARADOX",
        name: "The Indigo Awakening",
        description:
            "Sweet and indulgent signature dessert waffle.",
        priceInPaise: 6900,
    },
    {
        categoryName: "THE WAFFLE PARADOX",
        name: "The Dual Mirage",
        description:
            "A delicious combination of two sweet flavors.",
        priceInPaise: 7900,
    },
    {
        categoryName: "THE WAFFLE PARADOX",
        name: "The Peanut Butter Paradox",
        description:
            "Rich peanut butter dessert waffle.",
        priceInPaise: 5900,
    },

    // ============================================================
    // THE FROZEN PARADOX
    // ============================================================

    {
        categoryName: "THE FROZEN PARADOX",
        name: "Brownie Sundae",
        description:
            "Ice cream layered with warm brownie chunks and fudge.",
        priceInPaise: 7500,
    },
    {
        categoryName: "THE FROZEN PARADOX",
        name: "The Frozen Delusions",
        description:
            "Ice cream served in a crisp waffle bowl.",
        priceInPaise: 3500,
    },
    {
        categoryName: "THE FROZEN PARADOX",
        name: "Chocolate Ice Cream",
        description:
            "Rich and creamy chocolate ice cream.",
        priceInPaise: 3500,
    },
    {
        categoryName: "THE FROZEN PARADOX",
        name: "Butterscotch Ice Cream",
        description:
            "Creamy butterscotch ice cream with a sweet finish.",
        priceInPaise: 3500,
    },
];

const imageUrls: Record<string, string> = {
    // Drinks
    "The Minty Blueberry Awakening":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=85",

    "The Hibiscus Watermelon Mirage":
        "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=85",

    "The Jasmine Apple Illusion":
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85",

    "The Saffron Orange Trance":
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=85",

    "The Kaccha Aam Zinger":
        "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=85",

    "The Blue Ginger Delusion":
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",

    "The Watermelon Mint Mojito":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=85",

    "The Blueberry Mint Mojito":
        "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=85",

    "The KitKat Crunch Trance":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=85",

    "The Paradox Shake":
        "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=85",

    "Protein Smoothie Bowl":
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85",

    "The Vanilla Illusion":
        "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=85",

    "Teabox Wellness Green Tea":
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=85",

    "The Golden Delirium Latte":
        "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=800&q=85",

    "The Boosted Awakening":
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85",

    "The Delusion Hot Chocolate":
        "https://images.unsplash.com/photo-1542990253-0b7d5b1d7c3e?auto=format&fit=crop&w=800&q=85",

    // Savory food
    "Crispy Chicken Waffwich":
        "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=800&q=85",

    "Crispy Paneer Waffwich":
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=85",

    "Melted Pizza Waffle (Veg)":
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",

    "Melted Pizza Waffle (Chicken Sausage)":
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",

    "Creamy Chicken Wrap":
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=85",

    "Creamy Tikka Chicken Wrap":
        "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=85",

    "Creamy Paneer Wrap":
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85",

    "Crunchy Chicken Wrap":
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=85",

    "Pepper-Mayo Chicken Sandwich":
        "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=85",

    "Creamy Tikka Chicken Sandwich":
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85",

    "Cheesy Creamy Chicken Sandwich":
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85",

    "The Fresh Veggie Awakening":
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85",

    "DELIRIUM'S SIGNATURE FRIES":
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",

    "Loaded Nachos (Veg)":
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=85",

    "Chicken Popcorn":
        "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=800&q=85",

    "Paneer Tikka Skewers":
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=85",

    "Classic Masala Maggi":
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=85",

    "White Sauce Maggi":
        "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=85",

    "Red Sauce Maggi":
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=85",

    "Korean Spiced Maggi":
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=85",

    // Sweet waffles & desserts
    "The Kunafa Delirium":
        "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",

    "The Indigo Awakening":
        "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",

    "The Dual Mirage":
        "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",

    "The Peanut Butter Paradox":
        "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",

    "Brownie Sundae":
        "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",

    "The Frozen Delusions":
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=85",

    "Chocolate Ice Cream":
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=85",

    "Butterscotch Ice Cream":
        "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=85",
};

async function main() {
    console.log("🌱 Starting Delirium database seed...");

    /*
     * Development database only.
     *
     * Delete dependent records first because:
     *
     * CartItem  -> MenuItem
     * OrderItem -> MenuItem
     * MenuItem  -> Category
     *
     * This allows the menu/categories to be completely replaced.
     *
     * WARNING:
     * This removes existing cart items and order items.
     * Do NOT use this destructive reset against production data.
     */

    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();

    const categoryMap = new Map<string, string>();

    for (const categoryData of categories) {
        const category = await prisma.category.create({
            data: {
                name: categoryData.name,
                description: categoryData.description,
                displayOrder: categoryData.displayOrder,
                isActive: true,
            },
        });

        categoryMap.set(category.name, category.id);

        console.log(`Created category: ${category.name}`);
    }

    for (const menuItem of menuItems) {
        const categoryId = categoryMap.get(menuItem.categoryName);

        if (!categoryId) {
            throw new Error(
                `Category not found: ${menuItem.categoryName}`,
            );
        }

        const imageUrl = imageUrls[menuItem.name];

        if (!imageUrl) {
            throw new Error(
                `Image URL not found for menu item: ${menuItem.name}`,
            );
        }

        await prisma.menuItem.create({
            data: {
                categoryId,
                name: menuItem.name,
                description: menuItem.description,
                imageUrl,
                priceInPaise: menuItem.priceInPaise,
                isActive: true,
                isAvailable: true,
            },
        });

        console.log(`  Created menu item: ${menuItem.name}`);
    }

    console.log("");
    console.log("✅ Delirium seed completed successfully.");
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`🍽️ Menu items: ${menuItems.length}`);
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });