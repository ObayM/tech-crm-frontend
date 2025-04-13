"use client";
import Image from 'next/image';

export default function CustomerEmptyState({ searchTerm, onAddCustomer }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      
      {searchTerm ? (
        <>
          <h3 className="text-xl font-semibold text-gray-900">لا توجد نتائج مطابقة</h3>
          <p className="mt-2 text-gray-500 max-w-md">
            لم نتمكن من العثور على أي عملاء يطابقون "{searchTerm}". حاول تعديل كلمات البحث أو قم بإضافة عميل جديد.
          </p>
          <div className="mt-6">
            <button
              onClick={onAddCustomer}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full flex items-center transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              إضافة عميل جديد
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-900">قائمة العملاء فارغة</h3>
          <p className="mt-2 text-gray-500 max-w-md">
            لم تقم بإضافة أي عملاء بعد. أضف عميلك الأول الآن لبدء تتبع الاشتراكات.
          </p>
          <div className="mt-6">
            <button
              onClick={onAddCustomer}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full flex items-center shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              إضافة عميل جديد
            </button>
          </div>
        </>
      )}
    </div>
  );
}