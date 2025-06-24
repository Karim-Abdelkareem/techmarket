export const sidebarItems = [
    {
        title: "Analytics",
        icon: "📊",
        children: [
            { title: "Dashboard", icon: "📈", path: "/dashboard/analytics" },
            { title: "Overview", icon: "🔍", path: "/dashboard/analytics/overview" },
            { title: "Product Stats", icon: "📦", path: "/dashboard/analytics/products" },
            { title: "User Stats", icon: "👥", path: "/dashboard/analytics/users" },
            { title: "Most Viewed", icon: "👁️", path: "/dashboard/analytics/most-viewed" },
            { title: "Most Purchased", icon: "🛒", path: "/dashboard/analytics/most-bought" },
            { title: "Top Exclusive", icon: "⭐", path: "/dashboard/analytics/top-exclusive" },
        ],
    },
    {
        title: "Mobile & Tablets",
        icon: "📱",
        path: "/dashboard/category/mobile-tablets",
        children: [],
    },
    {
        title: "Accessories",
        icon: "🎧",
        children: [
            { title: "Cables", icon: "🔌", path: "/dashboard/category/accessories/cables" },
            { title: "Chargers", icon: "⚡", path: "/dashboard/category/accessories/chargers" },
            { title: "Power Bank", icon: "🔋", path: "/dashboard/category/accessories/power-bank" },
            { title: "Cases & Covers", icon: "📱", path: "/dashboard/category/accessories/cases" },
            { title: "Screen Protector", icon: "🛡", path: "/dashboard/category/accessories/screen-protector" },
        ],
    },
    {
        title: "Wearables",
        icon: "⌚",
        children: [
            { title: "Smart Bands", icon: "📶", path: "/dashboard/category/wearables/bands" },
            { title: "Smart Watches", icon: "🕒", path: "/dashboard/category/wearables/watches" },
        ],
    },
    {
        title: "Audio",
        icon: "🎧",
        children: [
            { title: "Over Ear", icon: "🎧", path: "/dashboard/category/audio/over-ear" },
            { title: "In Ear", icon: "🎧", path: "/dashboard/category/audio/in-ear" },
            { title: "Wireless", icon: "🎧", path: "/dashboard/category/audio/wireless" },
        ],
    },
    {
        title: "Laptops",
        icon: "💻",
        children: [
            { title: "Student", icon: "🎓", path: "/dashboard/category/laptops/student" },
            { title: "Professional", icon: "👨‍💻", path: "/dashboard/category/laptops/professional" },
            { title: "Gaming", icon: "🎮", path: "/dashboard/category/laptops/gaming" },
            { title: "X360", icon: "🔁", path: "/dashboard/category/laptops/x360" },
            { title: "Business", icon: "🧳", path: "/dashboard/category/laptops/business" },
            { title: "MacBook", icon: "🍎", path: "/dashboard/category/laptops/macbook" },
        ],
    },
];