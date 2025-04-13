// components/dashboard/Sidebar.jsx
'use client'
import { useEffect } from 'react';

export default function Sidebar({ isOpen, onClose }) {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && event.target.classList.contains('sidebar-backdrop')) {
        onClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen, onClose]);

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden sidebar-backdrop" />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transition-transform transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-500 to-blue-600">
            <h1 className="text-white text-xl font-bold">لوحة إدارة العملاء</h1>
            <button 
              onClick={onClose} 
              className="text-white md:hidden focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="mt-6 px-4 flex-1 overflow-y-auto">
            <div className="space-y-1.5">
              <a href="#" className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="font-medium">الرئيسية</span>
              </a>
              
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-medium">العملاء</span>
              </a>
              
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 9H4a1 1 0 00-1 1v3a1 1 0 001 1h12a1 1 0 001-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">الاشتراكات</span>
              </a>
              
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">التقارير</span>
              </a>
              
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">الإعدادات</span>
              </a>
            </div>
          </nav>
          
          {/* User Profile */}
          <div className="p-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-2xl">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">م</span>
                </div>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-800">مدير النظام</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}