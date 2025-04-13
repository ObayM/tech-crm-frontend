"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DeleteCustomerModal({ customer, onClose, onCustomerDeleted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const confirmationWord = 'حذف';

  const handleDelete = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id);
        
      if (error) throw error;
      
      onCustomerDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting customer:', error.message);
      alert('حدث خطأ أثناء حذف العميل');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDeleteButtonDisabled = confirmText !== confirmationWord || isSubmitting;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">حذف العميل</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <div className="shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-red-800">تحذير</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>أنت على وشك حذف العميل <span className="font-semibold">{customer.name}</span> وكافة بياناته من النظام.</p>
                    <p className="mt-1">هذا الإجراء لا يمكن التراجع عنه.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              لتأكيد الحذف، اكتب "{confirmationWord}" أدناه
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder={confirmationWord}
              dir="rtl"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors"
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={`px-6 py-3 text-sm font-medium text-white rounded-xl shadow-sm transition-colors flex items-center justify-center min-w-[100px] ${
              isDeleteButtonDisabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={isDeleteButtonDisabled}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'حذف العميل'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}