// src/components/RenewSubscriptionModal.js
"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { addMonths, format } from 'date-fns';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RenewSubscriptionModal({ customer, onClose, onSubscriptionRenewed }) {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    subscription_type: customer.subscription_type,
    start_date: formattedToday,
    duration: 1,
  });
  
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Calculate initial end date when component mounts
    calculateEndDate(formData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Calculate end date when start date, duration or subscription type changes
    if (['start_date', 'duration', 'subscription_type'].includes(name)) {
      calculateEndDate({...formData, [name]: value});
    }
  };

  const calculateEndDate = (data) => {
    if (!data.start_date) return;
    
    const startDate = new Date(data.start_date);
    let months = parseInt(data.duration) || 0;
    
    // Adjust months based on subscription type
    if (data.subscription_type === 'سنوي') {
      months *= 12;
    } else if (data.subscription_type === 'ربع سنوي') {
      months *= 3;
    }
    
    const calculatedEndDate = addMonths(startDate, months);
    setEndDate(format(calculatedEndDate, 'yyyy-MM-dd'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          subscription_type: formData.subscription_type,
          start_date: formData.start_date,
          duration: formData.duration,
          end_date: endDate
        })
        .eq('id', customer.id);

      if (error) throw error;
      
      onSubscriptionRenewed();
      onClose();
    } catch (error) {
      console.error('Error renewing subscription:', error);
      setError('حدث خطأ أثناء تجديد الاشتراك. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50" dir="rtl">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="absolute left-0 top-0 p-4">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            تجديد اشتراك عميل
          </h3>
        </div>
        
        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-medium text-lg">{customer.name[0]}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
              <p className="text-sm text-gray-500">{customer.service}</p>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subscription_type">
                  نوع الاشتراك <span className="text-red-500">*</span>
                </label>
                <select
                  id="subscription_type"
                  name="subscription_type"
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.subscription_type}
                  onChange={handleChange}
                >
                  <option value="شهري">شهري</option>
                  <option value="ربع سنوي">ربع سنوي</option>
                  <option value="سنوي">سنوي</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="start_date">
                    تاريخ البدء <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="duration">
                    المدة <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    required
                    min="1"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="end_date">
                  تاريخ الانتهاء
                </label>
                <input
                  id="end_date"
                  type="date"
                  disabled
                  className="block w-full border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={endDate}
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'جاري التجديد...' : 'تجديد الاشتراك'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}