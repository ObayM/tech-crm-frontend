"use client";

export default function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6  w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="إضافة عميل جديد"
    >
      <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-25"></span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    </button>
  );
}