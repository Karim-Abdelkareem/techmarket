import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { sidebarItems } from "../../data/sidebarItems";

const Sidebar = () => {
    const [openTabs, setOpenTabs] = useState({});
    const location = useLocation();

    const toggleTab = (title) =>
        setOpenTabs((prev) => ({ ...prev, [title]: !prev[title] }));

    return (
        <aside className="w-64 h-full bg-white shadow-xl border-r border-gray-200 overflow-y-auto">
            {/* Logo/Brand Section */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Tech Market</h1>
                <p className="text-sm text-gray-500 mt-1">Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                    <div key={item.title} className="space-y-1">
                        <div
                            onClick={() => item.children?.length && toggleTab(item.title)}
                            className={`
                                flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer
                                transition-all duration-200 ease-in-out group
                                ${item.path && location.pathname === item.path
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }
                                ${item.children?.length ? "hover:bg-gray-100" : ""}
                            `}
                        >
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    className="flex items-center gap-3 flex-1 min-w-0"
                                >
                                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                                    <span className="font-medium truncate">{item.title}</span>
                                </Link>
                            ) : (
                                <Link
                                    to={`/dashboard/category/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center gap-3 flex-1 min-w-0"
                                >
                                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                                    <span className="font-medium truncate">{item.title}</span>
                                </Link>
                            )}
                            {item.children?.length > 0 && (
                                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                                    {openTabs[item.title] ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            )}
                        </div>

                        {/* Submenu */}
                        {item.children && openTabs[item.title] && (
                            <div className="ml-4 pl-4 border-l border-gray-200 space-y-1">
                                {item.children.map((sub) => (
                                    <Link
                                        key={sub.title}
                                        to={sub.path}
                                        state={{ title: sub.title }}
                                        className={`
                                            flex items-center gap-3 px-4 py-2.5 rounded-md text-sm
                                            transition-all duration-200 ease-in-out group
                                            ${location.pathname === sub.path
                                                ? "bg-blue-500 text-white shadow-md font-medium"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:pl-6"
                                            }
                                        `}
                                    >
                                        <span className="text-base flex-shrink-0">{sub.icon}</span>
                                        <span className="truncate">{sub.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;