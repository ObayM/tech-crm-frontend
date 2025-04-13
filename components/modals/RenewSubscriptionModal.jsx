"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { format, addMonths, parseISO } from 'date-fns';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RenewSubscriptionModal({ customer, onClose, onSubscriptionRenewed }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('1');
  const [extendFrom, setExtendFrom] = useState('current_end'); // 'current_end' or 'today'
  
  // Calculate end date based on selection
  const calculateEndDate = () => {
    const months = parseInt(selectedPlan);
    const startDate = extendFrom === 'current_end' 
      ? new Date(customer.end_date) 
      : new Date();
    
    return format(addMonths(startDate, months), 'yyyy-MM-dd');
  };
  
  // Format end date for display
  const formattedEndDate = calculateEndDate();
  
  // Format current end date for display
  const formattedCurrentEndDate = format(parseISO(customer.end_date), 'yyyy-MM-dd');
  
  const handleRenew = async () => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ 
          end_date: formattedEndDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);
        
      if (error) throw error;
      
      onSubscriptionRenewed();
      onClose();
    } catch (error) {
      console.error('Error renewing subscription:', error.message);
      alert('حدث خطأ أثناء تجديد الاشتراك');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">تجديد الاشتراك</h3>
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
            <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg mb-6">
              <div className="flex">
                <div className="shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-3">
                  <p className="text-sm text-blue-700">
                    تاريخ انتهاء الاشتراك الحالي للعميل <span className="font-semibold">{customer.name}</span> هو <span className="font-semibold">{formattedCurrentEndDate}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدة التجديد
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: '1', label: 'شهر' },
                  { value: '3', label: '3 شهور' },
                  { value: '6', label: '6 شهور' },
                  { value: '12', label: 'سنة' }
                ].map((plan) => (
                  <button
                    key={plan.value}
                    type="button"
                    onClick={() => setSelectedPlan(plan.value)}
                    className={`py-3 px-4 text-sm font-medium rounded-xl transition-all ${
                      selectedPlan === plan.value
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {plan.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Extend From Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                بدء التجديد من
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600 w-5 h-5"
                    name="extendFrom"
                    value="current_end"
                    checked={extendFrom === 'current_end'}
                    onChange={() => setExtendFrom('current_end')}
                  />
                  <span className="mr-2 text-gray-700">تاريخ انتهاء الاشتراك الحالي</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600 w-5 h-5"
                    name="extendFrom"
                    value="today"
                    checked={extendFrom === 'today'}
                    onChange={() => setExtendFrom('today')}
                  />
                  <span className="mr-2 text-gray-700">من اليوم</span>
                </label>
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">تاريخ الانتهاء الجديد</p>
              <p className="text-lg font-semibold text-gray-900">{formattedEndDate}</p>
            </div>
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
            onClick={handleRenew}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center justify-center min-w-[100px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'تجديد'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}