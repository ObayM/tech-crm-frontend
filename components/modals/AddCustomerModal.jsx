"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { format, addMonths, isValid, parseISO } from 'date-fns';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Handle potential missing env vars during build/SSR if necessary
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key is missing. Ensure environment variables are set.");
}
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Constants for subscription types for better maintainability
const SUBSCRIPTION_TYPES = {
  MONTHLY: 'شهري',
  QUARTERLY: 'ربع سنوي',
  YEARLY: 'سنوي',
};

export default function AddCustomerModal({ isOpen, onClose, onCustomerAdded }) {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'تطبيق', // Default value
    subscription_type: SUBSCRIPTION_TYPES.MONTHLY,
    start_date: formattedToday,
    duration: 1,
    notes: ''
  });

  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Effect to calculate end date when dependencies change
  useEffect(() => {
    // Function to calculate end date based on current formData
    const calculateEndDate = () => {
      // Ensure start_date is valid before proceeding
      const startDate = parseISO(formData.start_date);
      if (!formData.start_date || !isValid(startDate)) {
        setEndDate('');
        return;
      }

      // Ensure duration is a positive number
      let monthsToAdd = parseInt(formData.duration, 10);
      if (isNaN(monthsToAdd) || monthsToAdd <= 0) {
        monthsToAdd = 0;
      }

      // Adjust months based on subscription type
      switch (formData.subscription_type) {
        case SUBSCRIPTION_TYPES.YEARLY:
          monthsToAdd *= 12;
          break;
        case SUBSCRIPTION_TYPES.QUARTERLY:
          monthsToAdd *= 3;
          break;
        // Default is monthly, no change needed
      }

      if (monthsToAdd > 0) {
        const calculatedEndDate = addMonths(startDate, monthsToAdd);
        setEndDate(format(calculatedEndDate, 'yyyy-MM-dd'));
      } else {
        setEndDate(formData.start_date);
      }
    };

    calculateEndDate();
  }, [formData.start_date, formData.duration, formData.subscription_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value, 10) || 0 : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم العميل مطلوب';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\d{12}$/.test(formData.phone.replace(/^0+/, ''))) {
      newErrors.phone = 'يجب أن يكون رقم الهاتف صحيح';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!endDate) {
      newErrors.duration = 'لا يمكن حساب تاريخ الانتهاء. يرجى التحقق من تاريخ البدء والمدة.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const customerData = {
        ...formData,
        end_date: endDate,
        created_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('customers')
        .insert([customerData]);
        
      if (insertError) {
        throw insertError;
      }
      
      onCustomerAdded();
      onClose();
    } catch (err) {
      console.error('Error adding customer:', err);
      setErrors({
        form: err.message || 'حدث خطأ غير متوقع أثناء إضافة العميل. الرجاء المحاولة مرة أخرى.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} dir="rtl">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-0 text-right shadow-xl transition-all">
                {/* Close Button */}
                <div className="absolute left-0 top-0 p-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    aria-label="إغلاق"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Header */}
                <Dialog.Title
                  as="div"
                  className="px-6 py-4 border-b border-gray-200"
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    إضافة عميل جديد
                  </h3>
                </Dialog.Title>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto">
                  {/* Error Display Area */}
                  {errors.form && (
                    <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200">
                      {errors.form}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Customer Details Section */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">بيانات العميل</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                            اسم العميل <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className={`block w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="أدخل اسم العميل"
                          />
                          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            البريد الإلكتروني
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className={`block w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@example.com"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                            رقم الهاتف <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <span className="text-gray-500">+966</span>
                            </div>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              className={`block w-full px-4 py-3 pr-14 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="05xxxxxxxx"
                            />
                          </div>
                          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Service & Subscription Section */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h4 className="text-sm font-semibold text-green-800 mb-3">بيانات الخدمة والاشتراك</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Service */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="service">
                            الخدمة <span className="text-red-500">*</span>
                          </label>
                          <input
                              type="text"
                              id="service"
                              name="service" 
                              className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                              value={formData.service}
                              onChange={handleChange}
                              placeholder="نوع الخدمة"
                            />
                        </div>

                        {/* Subscription Type & Duration */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subscription_type">
                              نوع الاشتراك <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="subscription_type"
                              name="subscription_type"
                              className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                              value={formData.subscription_type}
                              onChange={handleChange}
                            >
                              <option value={SUBSCRIPTION_TYPES.MONTHLY}>شهري</option>
                              <option value={SUBSCRIPTION_TYPES.QUARTERLY}>ربع سنوي</option>
                              <option value={SUBSCRIPTION_TYPES.YEARLY}>سنوي</option>
                            </select>
                            {errors.subscription_type && <p className="mt-1 text-sm text-red-500">{errors.subscription_type}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="duration">
                              المدة <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="duration"
                              name="duration"
                              type="number"
                              min="1"
                              className={`block w-full px-4 py-3 rounded-xl border ${errors.duration ? 'border-red-500' : 'border-gray-200'} focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                              value={formData.duration}
                              onChange={handleChange}
                            />
                            {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
                          </div>
                        </div>

                        {/* Start & End Dates */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="start_date">
                              تاريخ البدء <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="start_date"
                              name="start_date"
                              type="date"
                              className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={formData.start_date}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="end_date">
                              تاريخ الانتهاء
                            </label>
                            <input
                              id="end_date"
                              name="end_date"
                              type="date"
                              readOnly
                              className="block w-full px-4 py-3 rounded-xl border bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-600"
                              value={endDate}
                              tabIndex={-1}
                            />
                          </div>
                        </div>

                        {/* Notes Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                            ملاحظات
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="أي ملاحظات إضافية..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !endDate}
                      className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'حفظ'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}