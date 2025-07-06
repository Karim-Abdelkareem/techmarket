import React, { useState, useEffect, useRef } from 'react';
import { getAllMessages, sendMessage, deleteMessage } from '../../services/api';
import { FiSend, FiTrash2, FiUser, FiMessageCircle, FiSearch, FiMoreVertical } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UserChats = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getAllMessages();
      const messagesData = response.messages || [];
      setMessages(messagesData);
      
      // Extract unique users from messages
      const uniqueUsers = [];
      const userMap = new Map();
      
      messagesData.forEach(message => {
        const user = message.from;
        if (user && !userMap.has(user._id)) {
          userMap.set(user._id, user);
          uniqueUsers.push(user);
        }
      });
      
      setUsers(uniqueUsers);
      if (uniqueUsers.length > 0 && !selectedUser) {
        setSelectedUser(uniqueUsers[0]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || sending) return;

    try {
      setSending(true);
      const messageData = {
        to: selectedUser._id,
        message: newMessage.trim()
      };

      await sendMessage(messageData);
      setNewMessage('');
      
      // Refresh messages
      await fetchMessages();
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      await fetchMessages();
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = selectedUser 
    ? messages.filter(msg => 
        (msg.from._id === selectedUser._id && msg.to._id !== selectedUser._id) ||
        (msg.to._id === selectedUser._id && msg.from._id !== selectedUser._id)
      )
    : [];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <FiMessageCircle size={48} className="mx-auto" />
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto h-screen p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-full flex">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
              <p className="text-gray-400 text-sm">Chat with our support team</p>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-6 text-center">
                  <FiUser className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-400 text-sm">No contacts found</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 mb-2 ${
                        selectedUser?._id === user._id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedUser?._id === user._id ? 'bg-blue-500' : 'bg-gray-600'
                        }`}>
                          <span className="text-white font-semibold text-lg">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.name || 'Unknown User'}</p>
                          <p className="text-sm opacity-75 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {selectedUser.name || 'Unknown User'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <FiMoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <FiMessageCircle size={64} className="mx-auto" />
                      </div>
                      <p className="text-gray-300 text-lg font-medium">No messages yet</p>
                      <p className="text-gray-400 text-sm">Start a conversation with {selectedUser.name || 'this user'}!</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => {
                      const isOwnMessage = message.from._id !== selectedUser._id;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-200'
                          }`}>
                            <div className="flex items-start justify-between">
                              <p className="text-sm leading-relaxed">{message.message}</p>
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="ml-3 text-xs opacity-75 hover:opacity-100 transition-opacity"
                                title="Delete message"
                              >
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                            <p className="text-xs opacity-75 mt-2">
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FiSend size={16} />
                      )}
                      <span>{sending ? 'Sending...' : 'Send'}</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <FiMessageCircle size={64} className="mx-auto" />
                  </div>
                  <p className="text-gray-300 text-lg font-medium">Select a contact</p>
                  <p className="text-gray-400 text-sm">Choose someone to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChats;