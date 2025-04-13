// app/chat/[phone]/page.js
"use client";

// Import React.memo and useMemo
import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import AddCustomerModal from '@/components/modals/AddCustomerModal';
import {
  ChevronLeftIcon, PhoneIcon, VideoCameraIcon, EllipsisVerticalIcon,
  PaperClipIcon, FaceSmileIcon, MicrophoneIcon, PaperAirplaneIcon,
  XMarkIcon, PhotoIcon, DocumentIcon, CameraIcon, MapPinIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Ensure these environment variables are set correctly in your .env.local
// NEXT_PUBLIC_API_URL=http://localhost:8000  (or your backend HTTP URL)
// NEXT_PUBLIC_WS_URL=ws://localhost:8000     (or your backend WS URL - note ws://)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'; // Make sure this starts with ws:// or wss://


const MessageBubble = memo(({ message, formatMessageTime }) => {
    // Using React.memo prevents re-rendering this component if its props (message, formatMessageTime) haven't changed.
    return (
        <div key={message.id} className={`flex ${message.is_from_me ? 'justify-end' : 'justify-start'}`}>
            <div
               className={`relative max-w-[75%] md:max-w-[60%] rounded-lg px-3 py-2 shadow-sm ${
                 message.is_from_me
                   ? 'bg-[#DCF8C6] text-gray-800 rounded-br-none' // Sent message style
                   : 'bg-white text-gray-800 rounded-bl-none'      // Received message style
               }`}
               style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
               {/* Message Content */}
               <p className="text-sm leading-snug mr-10">{message.content}</p>

               {/* Timestamp and Status Icons */}
               <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                  {/* Pending Icon (Clock) */}
                  {message.is_from_me && message.pending && !message.failed && (
                     <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                       <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                       <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                     </svg>
                  )}
                  {/* Failed Icon (Exclamation) */}
                  {message.is_from_me && message.failed && (
                      <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                  )}
                  {/* Timestamp */}
                  <span className={`text-[10px] text-gray-500`}>{formatMessageTime(message.timestamp)}</span>
                  {/* Delivery Status Icons (Checkmarks) */}
                   {message.is_from_me && !message.pending && !message.failed && message.status === 'sent' && (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg> // Single check for sent
                   )}
                   {/* Example: Add more checks for 'delivered', 'read' based on message.status */}
                   {/* {message.is_from_me && !message.pending && !message.failed && message.status === 'delivered' && ( ... double check ... )} */}
                   {/* {message.is_from_me && !message.pending && !message.failed && message.status === 'read' && ( ... double blue check ... )} */}
               </div>
             </div>
           </div>
    );
});
MessageBubble.displayName = 'MessageBubble'; // Helps in React DevTools
// --- End Message Bubble Component ---


export default function ChatPage() {
  // --- State and Refs ---
  const params = useParams();
  const router = useRouter();
  const { phone } = params;
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Example state for typing indicator
  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const wsRef = useRef(null);

  // --- End State and Refs ---

  // --- WebSocket Connection Effect ---
  useEffect(() => {
    if (!phone) return;

    // Ensure WS_BASE_URL starts with ws:// or wss://
    const wsUrl = `${WS_BASE_URL}/ws/chat/${phone}`;
    console.log("Attempting NATIVE WebSocket connection to:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Native WebSocket connected');
      setIsConnected(true);
    };

    ws.onclose = (event) => {
      console.log('Native WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      wsRef.current = null;
      // Consider implementing automatic reconnection logic here if desired
    };

    ws.onerror = (event) => {
      console.error('Native WebSocket error event:', event);
      setIsConnected(false);
      wsRef.current = null;
    };

    // --- WebSocket Message Handler (Improved Deduplication) ---
    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
        console.log('Native WebSocket message received:', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
        return; // Ignore malformed messages
      }

      setMessages(prevMessages => {
          switch (data.type) {
              case 'message_status':
                  // Update status of an optimistically sent message
                  if (!data.tempId) return prevMessages;
                  return prevMessages.map(msg =>
                      msg.id === data.tempId
                      ? {
                          ...msg,
                          status: data.status,
                          pending: false,
                          failed: data.status === 'failed',
                          id: data.message_id || msg.id // Update ID if final one provided
                        }
                      : msg
                  );

              case 'receive-message':
                  // Handle incoming messages (from others or broadcast of own sent msg)
                  let messageExists = false;

                  // Check if it updates an optimistic message using tempId
                  if (data.tempId) {
                      let foundTemp = false;
                      const updatedMessages = prevMessages.map(msg => {
                          if (msg.id === data.tempId) {
                              foundTemp = true;
                              // Update existing optimistic message with final data
                              return { ...msg, ...data, pending: false };
                          }
                          return msg;
                      });
                      if (foundTemp) return updatedMessages; // Return updated list if temp matched
                  }

                  // If no tempId match, check if we already have this message by its final ID
                  if (data.id && !String(data.id).startsWith('temp-')) {
                       messageExists = prevMessages.some(m => m.id === data.id);
                  }

                  // If message already exists (by final ID), ignore this update
                  if (messageExists) {
                      console.log("Duplicate message received (already have final ID), ignoring:", data.id);
                      return prevMessages;
                  }

                  // If it's a new message (didn't match tempId and doesn't exist by final ID), add it.
                  console.log("Adding new message:", data.id);
                  const messageToAdd = { ...data, pending: false };
                  // Ensure timestamp is valid for sorting (optional if always sorted)
                  // const newMessages = [...prevMessages, messageToAdd];
                  // newMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                  // return newMessages;
                  return [...prevMessages, messageToAdd];


              case 'typing_indicator':
                  console.log('Typing indicator:', data);
                  setIsTyping(data.user !== 'You' && data.is_typing); // Example: Show if others are typing
                  return prevMessages; // Message list unchanged

              case 'connection_established':
                  console.log('Connection confirmed by server via WebSocket');
                  return prevMessages; // Message list unchanged

              default:
                  console.warn("Received unknown WebSocket message type:", data.type);
                  return prevMessages; // Return unchanged state for unknown types
          }
      });
    };
     // --- End WebSocket Message Handler ---

    // Cleanup function
    return () => {
      console.log('Closing WebSocket connection');
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
      setIsConnected(false);
      setIsTyping(false);
    };
  }, [phone]); // Dependency array
  // --- End WebSocket Connection Effect ---


  // --- Fetch Initial Chat Data Effect ---
  useEffect(() => {
    if (!phone) return;
    let isMounted = true; // Prevent state updates on unmounted component

    const fetchChatData = async () => {
      setLoading(true);
      setError(null);
      // Ensure trailing slash if your backend route expects it, to avoid 307 redirect
      const apiUrl = `${API_BASE_URL}/chats/phone/${phone}/`;
      console.log("Fetching chat data from:", apiUrl);

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true', // If using ngrok
            'Content-Type': 'application/json',
            // Add Authorization header if you re-enable auth
          },
        });

        if (!isMounted) return; // Don't update state if component unmounted

        if (!response.ok) {
          let errorBody = 'Failed to fetch';
          try { errorBody = await response.text(); } catch (_) {}
          throw new Error(`HTTP Error ${response.status}: ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        setChat(data.chat);
        // Ensure messages are sorted correctly (backend might do this already)
        setMessages(data.messages.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ));
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch chat data:", err);
        setError(err instanceof Error ? err.message : 'Failed to load chat');
        setChat(null);
        setMessages([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChatData();

    return () => { isMounted = false; }; // Cleanup function for fetch effect

  }, [phone]);
  // --- End Fetch Initial Chat Data Effect ---


  // --- Scroll To Bottom Effect ---
  useEffect(() => {
    // Scroll to bottom smoothly when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // --- End Scroll To Bottom Effect ---


  // --- Send Message Handler ---
  const sendMessage = async (e) => {
    e.preventDefault();

    // Check connection state via wsRef
    if (!newMessage.trim() || !phone || sending || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send message. Input empty, sending, or not connected.");
      if (!isConnected) {
          alert("Not connected. Please wait or try refreshing.");
      }
      return;
    }

    // Create optimistic message
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const optimisticMessage = {
      id: tempId,
      timestamp: new Date().toISOString(),
      sender: 'You', // Replace with actual user identifier if available
      content: newMessage,
      is_from_me: true,
      chat_jid: chat?.jid || `unknown-jid-${phone}`, // Use known JID or placeholder
      pending: true, // Mark as pending initially
      failed: false,
      status: 'sending' // Custom status for UI
    };

    // Add optimistic message to state immediately
    setMessages(prev => [...prev, optimisticMessage]);

    const messageToSend = newMessage;
    setNewMessage(''); // Clear input
    // setSending(true); // We use the 'pending' state on the message now

    inputRef.current?.focus(); // Refocus input

    // Send message via WebSocket
    try {
      console.log(`Sending message via NATIVE WS with tempId: ${tempId}`);
      wsRef.current.send(JSON.stringify({
        type: 'send-message',
        chatId: phone, // Ensure backend uses this if needed
        content: messageToSend,
        sender: optimisticMessage.sender,
        tempId: tempId // Crucial for backend to correlate and send status back
      }));
      // Note: We don't setSending(false) here. The 'pending' state is cleared
      // when the 'message_status' comes back from the WebSocket.
    } catch (err) {
      console.error('Error sending message via WebSocket:', err);
      // Mark the optimistic message as failed immediately if send() throws error
      setMessages(prev => prev.map(msg =>
        msg.id === tempId
          ? { ...msg, failed: true, pending: false, status: 'failed' }
          : msg
      ));
      alert(`Failed to send message: ${err.message}. Please try again.`);
      setNewMessage(messageToSend); // Restore message to input
    }
  };
  // --- End Send Message Handler ---


  // --- Formatting Functions ---
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return !isNaN(date.getTime()) ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : '--:--';
    } catch (e) { return '--:--'; }
  };

  const formatMessageDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Date';
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (messageDate.getTime() === todayDate.getTime()) return 'Today';
      if (messageDate.getTime() === yesterdayDate.getTime()) return 'Yesterday';
      const options = { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined };
      return date.toLocaleDateString(undefined, options);
    } catch (e) { return 'Invalid Date'; }
  };
  // --- End Formatting Functions ---


  // --- Memoize Message Group Calculation ---
  const messageGroups = useMemo(() => {
    console.log("Recalculating message groups..."); // Log to see frequency
    const groups = {}; // Initialize as empty object

    messages.forEach(message => {
      // Ensure message and timestamp are valid before processing
      if (!message || !message.timestamp) {
          console.warn("Skipping message with invalid timestamp:", message);
          return; // Skip this message
      }
      try {
        const dateObj = new Date(message.timestamp);
        // Generate a key based on the date string, handle invalid dates
        const dateKey = !isNaN(dateObj.getTime()) ? dateObj.toDateString() : 'invalid-date';

        // If this date key hasn't been seen before, initialize its entry
        if (!groups[dateKey]) {
          groups[dateKey] = {
            date: dateKey, // Store the key itself
            formattedDate: dateKey !== 'invalid-date' ? formatMessageDate(message.timestamp) : 'Invalid Date', // Format date once
            messages: [] // Initialize an empty array for messages of this date
          };
        }

        // --- FIXED: Push the message onto the 'messages' array within the group object ---
        groups[dateKey].messages.push(message);
        // --- End Fix ---

      } catch (e) {
        console.error("Error grouping message:", e, "Message:", message);
      }
    });

    // Convert the groups object into an array and sort it by date
    return Object.values(groups).sort((a, b) => {
        // Handle potential 'invalid-date' keys during sorting
        if (a.date === 'invalid-date') return 1; // Push invalid dates to the end
        if (b.date === 'invalid-date') return -1; // Push invalid dates to the end
        // Sort valid dates chronologically
        return new Date(a.date) - new Date(b.date);
    });
  }, [messages]); // Dependency array: Recalculate only when 'messages' changes
  // --- End Memoized Message Group Calculation ---


  // --- Loading and Error UI ---
  if (loading && !chat) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error && !chat) { // Show primary error only if chat data failed to load
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Couldn't Load Chat</h2>
          <p className="text-gray-600 mb-6 break-words">{error}</p>
          <button
            onClick={() => router.push('/dashboard')} // Navigate back
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  // --- End Loading and Error UI ---


  // --- Main Chat UI JSX ---
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white text-gray-800 px-4 py-3 flex items-center shadow-sm z-10 sticky top-0 border-b border-gray-200">
         <Link href="/dashboard" className="mr-3 p-1 rounded-full hover:bg-gray-100">
           <ChevronLeftIcon className="h-6 w-6 text-blue-500" />
         </Link>
         {/* Avatar */}
         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
           <span className="text-blue-600 font-semibold text-lg">
             {chat?.name?.[0]?.toUpperCase() || phone?.[0] || '?'}
           </span>
         </div>
         {/* Name and Status */}
         <div className="flex-1 min-w-0">
           <h1 className="font-semibold text-lg truncate">{chat?.name || phone}</h1>
           <p className={`text-xs transition-colors duration-300 ${isConnected ? 'text-green-500' : 'text-gray-500'}`}>
              {isConnected ? (isTyping ? 'typing...' : 'Online') : 'Connecting...'}
           </p>
         </div>
         {/* Action Buttons */}
         <div className="flex space-x-2 sm:space-x-4 ml-2">
           <button className="p-2 text-blue-500 rounded-full hover:bg-blue-50 transition">
             <VideoCameraIcon className="h-5 w-5" />
           </button>
           <button className="p-2 text-blue-500 rounded-full hover:bg-blue-50 transition">
             <PhoneIcon className="h-5 w-5" />
           </button>
           <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition">
           <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />
           </button>
         </div>


      </header>


      {isAddModalOpen && (
              <AddCustomerModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)} 
              />
            )}

      {/* Messages Area */}
      {/* Consider adding a loading indicator overlay here if !chat && loading */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto bg-[#E5DDD5] p-4 space-y-1.5" // Reduced space slightly
        // Consider background image for WhatsApp feel
        // style={{ backgroundImage: "url('/whatsapp-bg.png')", backgroundSize: 'auto', backgroundRepeat: 'repeat' }}
      >
        {/* Use memoized messageGroups and memoized MessageBubble */}
        {messageGroups.map((group) => (
          <div key={group.date} className="space-y-1.5"> {/* Reduced space */}
            {/* Date Separator */}
            <div className="flex justify-center sticky top-2 z-0 my-2">
              <span className="bg-[#e2e2e2] text-[#5f5f5f] text-xs font-medium px-3 py-1 rounded-lg shadow-sm">
                {group.formattedDate}
              </span>
            </div>
            {/* Render messages using the memoized component */}
            {group.messages.map((message) => (
              <MessageBubble
                 key={message.id} // Important: Use unique ID
                 message={message}
                 formatMessageTime={formatMessageTime}
               />
            ))}
          </div>
        ))}
        {/* Element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="bg-[#F0F0F0] px-3 py-2 flex items-center space-x-2 border-t border-gray-300">
         <button type="button" className="p-2 text-gray-500 rounded-full hover:bg-gray-200 transition" aria-label="Emoji">
           <FaceSmileIcon className="h-6 w-6" />
         </button>
         <button type="button" onClick={() => setShowAttachMenu(true)} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 transition" aria-label="Attach file">
           <PaperClipIcon className="h-6 w-6 transform rotate-45" />
         </button>
         {/* Input Field */}
         <div className="relative flex-1">
           <input
             type="text" ref={inputRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
             placeholder="Type a message"
             className="w-full py-2.5 px-4 pr-6 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
             autoComplete="off"
           />
         </div>
         {/* Send/Mic Button */}
         <button
            type="submit"
            // Disable if not connected OR message is empty (allow sending even if 'sending' is true via pending state)
            disabled={!isConnected || !newMessage.trim()}
            className={`p-3 rounded-full flex-shrink-0 transition duration-150 ease-in-out ${
             (newMessage.trim() && isConnected) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={newMessage.trim() ? "Send message" : "Record voice message"}
          >
           {newMessage.trim() ? <PaperAirplaneIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
         </button>
       </form>

      {/* Attachment Menu Modal */}
      <Transition appear show={showAttachMenu} as={Fragment}>
          {/* Dialog structure unchanged... */}
           <Dialog as="div" className="relative z-20" onClose={() => setShowAttachMenu(false)}>
               <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                 <div className="fixed inset-0 bg-black bg-opacity-30" />
               </Transition.Child>
               <div className="fixed inset-0 overflow-y-auto">
                 <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
                   <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-12 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-12 sm:translate-y-0 sm:scale-95">
                     <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-2xl sm:rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                       <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-4 text-center">
                           {/* Attachment Buttons... */}
                            <button className="flex flex-col items-center group">...</button>
                            <button className="flex flex-col items-center group">...</button>
                            <button className="flex flex-col items-center group">...</button>
                            <button className="flex flex-col items-center group">...</button>
                            <button className="flex flex-col items-center group">...</button>
                            <button className="flex flex-col items-center group">...</button>
                       </div>
                     </Dialog.Panel>
                   </Transition.Child>
                 </div>
               </div>
           </Dialog>
      </Transition>


    </div> // End main container
  );
} // End ChatPage component