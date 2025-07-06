import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const UserAccountPage = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('profile')
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = localStorage.getItem('user')
                if (userData) {
                    const parsedUser = JSON.parse(userData)
                    setUser(parsedUser)
                } else {
                    setError('No user data found')
                }
                setLoading(false)
            } catch (error) {
                setError('Error loading user data')
                setLoading(false)
                console.error('Error parsing user data:', error)
            }
        }
        fetchUser()
    }, [])

    // Mock orders data - in real app, this would come from API
    useEffect(() => {
        if (user) {
            setOrders([
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    status: 'Delivered',
                    total: 2500,
                    items: 3
                },
                {
                    id: 'ORD-002',
                    date: '2024-01-10',
                    status: 'Processing',
                    total: 1800,
                    items: 2
                }
            ])
        }
    }, [user])

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-red-400">{error}</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-white">No user data available</div>
            </div>
        )
    }

    const renderProfileTab = () => (
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            value={user.name || ''} 
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={user.email || ''} 
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            value={user.phone || 'Not provided'} 
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                        <input 
                            type="text" 
                            value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer'} 
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-600 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Edit Profile
                </button>
            </div>
        </div>
    )

    const renderOrdersTab = () => (
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Order History</h2>
            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <p className="text-gray-300">No orders found</p>
                    <Link to="/products/Laptop" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-white">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-400">{order.date}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'Delivered' 
                                        ? 'bg-green-900 text-green-300' 
                                        : 'bg-yellow-900 text-yellow-300'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-400">
                                    {order.items} item{order.items > 1 ? 's' : ''}
                                </div>
                                <div className="font-semibold text-white">
                                    ${order.total}
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-600 flex justify-end">
                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    const renderTrackOrderTab = () => (
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Track Your Order</h2>
            <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
                <p className="text-gray-300 mb-4">You can track your orders here soon.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors" disabled>
                    Coming Soon
                </button>
            </div>
        </div>
    )

    const renderSettingsTab = () => (
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Account Settings</h2>
            <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19a7 7 0 100-14 7 7 0 000 14z" />
                    </svg>
                </div>
                <p className="text-gray-300 mb-4">Settings options will be available soon.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors" disabled>
                    Coming Soon
                </button>
            </div>
        </div>
    )

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileTab()
            case 'orders':
                return renderOrdersTab()
            case 'track':
                return renderTrackOrderTab()
            case 'settings':
                return renderSettingsTab()
            default:
                return renderProfileTab()
        }
    }

    return (
        <div className="min-h-screen bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">My Account</h1>
                    <p className="text-gray-300 mt-2">Welcome back, {user.name || 'Customer'}!</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                                        activeTab === 'profile'
                                            ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                                        activeTab === 'orders'
                                            ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Order History
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('track')}
                                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                                        activeTab === 'track'
                                            ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                        Track Your Order
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                                        activeTab === 'settings'
                                            ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19a7 7 0 100-14 7 7 0 000 14z" />
                                        </svg>
                                        Settings
                                    </div>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAccountPage