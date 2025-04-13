// components/dashboard/Header.jsx
export default function Header({ title, onAddCustomer, onToggleSidebar, showSidebar }) {
    return (
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Mobile menu button
              <button
                onClick={onToggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
              >
                {showSidebar ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button> */}
              
              <h1 className="text-xl font-bold text-gray-900 mr-3 md:mr-0">{title}</h1>
            </div>
            
            {/* Add Customer Button - Hidden on mobile */}
            <button
              onClick={onAddCustomer}
              className="hidden md:flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              إضافة عميل جديد
            </button>
          </div>
        </div>
      </header>
    );
  }