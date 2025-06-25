import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight, FaUsers, FaBuilding, FaSignOutAlt, FaUser, FaCog, FaBell } from "react-icons/fa";
import { sidebarItems } from "../../data/sidebarItems";

const adminItems = [
    {
        title: 'Moderators',
        icon: <FaUsers />,
        path: '/admin/moderators',
    },
    {
        title: 'Companies',
        icon: <FaBuilding />,
        path: '/admin/companies',
    },
];

const Sidebar = ({ user, onLogout }) => {
    const [openTabs, setOpenTabs] = useState({});
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();

    const toggleTab = (title) =>
        setOpenTabs((prev) => ({ ...prev, [title]: !prev[title] }));

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'moderator':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'user':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <aside className="w-72 h-full bg-white shadow-xl border-r border-gray-200 overflow-y-auto flex flex-col">
            {/* Logo/Brand Section */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Tech Market</h1>
                <p className="text-sm text-gray-500 mt-1">Dashboard</p>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {user?.name || user?.username || 'User'}
                        </p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                            <span className="capitalize">{user?.role}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md w-full">
                        <FaUser className="h-4 w-4" />
                        <span>Profile</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <FaBell className="h-4 w-4" />
                        <span className="relative">
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </span>
                    </button>
                    <button 
                        onClick={onLogout}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                        <FaSignOutAlt className="h-4 w-4" />
                    </button>
                </div>
            </div>

           

            {/* Admin Navigation */}
            <nav className="p-4 space-y-2 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin</h3>
                {adminItems.map((item) => (
                    <div key={item.title} className="space-y-1">
                        <div
                            className={`
                                flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer
                                transition-all duration-200 ease-in-out group
                                ${location.pathname === item.path
                                    ? "bg-red-600 text-white shadow-lg"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }
                            `}
                        >
                            <Link
                                to={item.path}
                                className="flex items-center gap-3 flex-1 min-w-0"
                            >
                                <span className="text-lg flex-shrink-0">{item.icon}</span>
                                <span className="font-medium truncate">{item.title}</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </nav>

            {/* Product Navigation */}
            <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Products</h3>
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
                                <span className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                                    <span className="font-medium truncate">{item.title}</span>
                                </span>
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