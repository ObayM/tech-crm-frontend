'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronRight, Search, MessageCircle, MoreHorizontal, User, Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const limit = 50;

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        // Direct fetch from your backend API
        const response = await fetch(`/api/chats?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch chats');
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);

      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [page]);

  const openChat = (chat) => {
    const phoneNumber = chat.jid.split('@')[0];
    router.push(`/chat/${phoneNumber}`);
  };

  const openChatDetails = (e, chat) => {
    e.stopPropagation();
    setSelectedChat(chat);
    setIsModalOpen(true);
  };

  // Format date to show time if today, or date if older
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    
    if (isNaN(date.getTime())) return '';
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // If within the last week, show day name
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get the name or phone number to display
  const getDisplayName = (chat) => {
    if (chat.name) return chat.name;
    // Extract phone number from JID
    return chat.jid.split('@')[0];
  };

  // Get the avatar text (initials or first letter)
  const getAvatarText = (chat) => {
    if (chat.name) {
      const names = chat.name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return chat.name[0].toUpperCase();
    }
    return chat.jid[0].toUpperCase();
  };

  // Get avatar color based on string
  const getAvatarColor = (str) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-yellow-100 text-yellow-600',
      'bg-indigo-100 text-indigo-600',
      'bg-red-100 text-red-600',
      'bg-cyan-100 text-cyan-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Format preview message
  const getMessagePreview = (chat) => {
    if (!chat.last_message) return 'No messages yet';
    
    const prefix = chat.last_is_from_me ? 'You: ' : 
                  (chat.last_sender ? `${chat.last_sender}: ` : '');
    
    return `${prefix}${chat.last_message}`;
  };

  // Filter chats based on search query
  const filteredChats = searchQuery 
    ? chats.filter(chat => 
        (chat.name && chat.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        chat.jid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.last_message && chat.last_message.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : chats;

  

  const displayChats = filteredChats.length > 0 ? filteredChats : chats;



  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* iOS-style header */}
      <div className="bg-white shadow-sm px-4 pt-6 pb-3 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 py-3 sticky top-16 bg-gray-50 z-10">
        <div className="bg-gray-200 rounded-xl flex items-center px-4 py-2">
          <Search size={16} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search messages"
            className="bg-transparent flex-1 text-sm outline-none text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              <span className="text-gray-500 mt-3">Loading conversations...</span>
            </div>
          </div>
        ) : displayChats.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40">
            <MessageCircle size={40} className="text-gray-300 mb-2" />
            <p className="text-gray-500 text-center">No conversations yet</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm">
              Start a new chat
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {displayChats.map((chat) => (
              <li 
                key={chat.jid} 
                className="hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition-colors" 
                onClick={() => openChat(chat)}
              >
                <div className="flex items-center px-4 py-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-3 ${getAvatarColor(chat.jid)}`}>
                    {getAvatarText(chat)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {getDisplayName(chat)}
                      </h3>
                      <span className="text-xs text-gray-500 ml-1">
                        {formatDate(chat.last_message_time)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-sm truncate pr-2  text-gray-500`}>
                        {getMessagePreview(chat)}
                      </p>
                      
                    </div>
                  </div>
                  <button 
                    onClick={(e) => openChatDetails(e, chat)}
                    className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination controls */}
      {displayChats.length >= limit && (
        <div className="flex justify-between items-center p-4 bg-white border-t">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`px-4 py-2 rounded-full text-sm ${
              page === 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-500'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-full text-sm bg-blue-50 text-blue-500"
          >
            Next
          </button>
        </div>
      )}


      {/* Chat details modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedChat && (
                    <>
                      <div className="flex items-center mb-4">
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center mr-4 ${getAvatarColor(selectedChat.jid)}`}>
                          {getAvatarText(selectedChat)}
                        </div>
                        <div>
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-semibold text-gray-900"
                          >
                            {getDisplayName(selectedChat)}
                          </Dialog.Title>
                          <p className="text-sm text-gray-500">
                            {selectedChat.jid}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                        {selectedChat.last_message ? (
                          <>
                            <p className="text-sm text-gray-900">
                              {getMessagePreview(selectedChat)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {selectedChat.last_message_time ? 
                                new Date(selectedChat.last_message_time).toLocaleString() : 
                                'Unknown time'}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No recent messages</p>
                        )}
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <button
                          type="button"
                          className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Close
                        </button>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
                            onClick={() => {
                              openChat(selectedChat);
                              setIsModalOpen(false);
                            }}
                          >
                            Message
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}