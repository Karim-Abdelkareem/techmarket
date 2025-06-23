import React, { useState } from 'react';
import { User, Shield, Settings, LogOut, Bell, Search, Menu, ChevronDown } from 'lucide-react';

const DashboardHeader = ({ toggleSidebar, user, onLogout }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

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

    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return <Shield className="h-4 w-4" />;
            case 'moderator':
                return <Settings className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Left side - Menu toggle and search */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Menu className="h-5 w-5 text-gray-600" />
                    </button>

                    <div className="hidden sm:flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Right side - Notifications and user menu */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name || user?.username || 'User'}
                                </p>
                                <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                                    {getRoleIcon(user?.role)}
                                    <span className="capitalize">{user?.role}</span>
                                </div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {/* Dropdown menu */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                    <div className="p-4 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name || user?.username || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoleColor(user?.role)}`}>
                                            {getRoleIcon(user?.role)}
                                            <span className="capitalize">{user?.role}</span>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                                            <User className="h-4 w-4" />
                                            <span>Profile</span>
                                        </button>
                                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                                            <Settings className="h-4 w-4" />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-gray-100">
                                        <button
                                            onClick={onLogout}
                                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;