// components/customers/CustomerActions.jsx
import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function CustomerActions({ customer, onRenew, onEdit, onDelete, onChat }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center space-x-3 space-x-reverse">
      {/* Chat Button - Always Visible */}
      <button
        onClick={onChat}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        محادثة
      </button>

      {/* Renew Button - Always Visible for Desktop */}
      <button
        onClick={onRenew}
        className="hidden md:inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        تجديد
      </button>

      {/* More Actions Menu */}
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button 
            className="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          show={isMenuOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          afterLeave={() => setIsMenuOpen(false)}
        >
          <Menu.Items className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 py-1">
            {/* Renew - Only on Mobile */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRenew();
                  }}
                  className={`md:hidden flex items-center px-4 py-2 text-sm w-full text-right ${
                    active ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  تجديد الاشتراك
                </button>
              )}
            </Menu.Item>

            {/* Edit */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit();
                  }}
                  className={`flex items-center px-4 py-2 text-sm w-full text-right ${
                    active ? 'bg-gray-50 text-gray-700' : 'text-gray-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل البيانات
                </button>
              )}
            </Menu.Item>

            {/* Delete */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete();
                  }}
                  className={`flex items-center px-4 py-2 text-sm w-full text-right ${
                    active ? 'bg-gray-50 text-red-600' : 'text-red-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  حذف العميل
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}