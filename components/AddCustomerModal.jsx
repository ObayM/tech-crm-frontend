// src/components/AddCustomerModal.js
"use client";
import { useState, useEffect } from 'react'; // Import useEffect
import { createClient } from '@supabase/supabase-js';
import { addMonths, format, isValid, parseISO } from 'date-fns'; // Import isValid, parseISO

// Initialize Supabase client (ensure these are loaded correctly)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Handle potential missing env vars during build/SSR if necessary
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key is missing. Ensure environment variables are set.");
  // You might want to return a placeholder or null component here if rendering server-side initially
}
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Constants for subscription types for better maintainability
const SUBSCRIPTION_TYPES = {
  MONTHLY: 'شهري',
  QUARTERLY: 'ربع سنوي',
  YEARLY: 'سنوي',
};

export default function AddCustomerModal({ onClose, onCustomerAdded }) {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    subscription_type: SUBSCRIPTION_TYPES.MONTHLY, // Use constant
    start_date: formattedToday,
    duration: 1, // Ensure this is treated as a number
  });

  const [endDate, setEndDate] = useState(''); // Calculated end date
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // Stores error messages

  // Effect to calculate end date initially and when dependencies change
  useEffect(() => {
    // Function to calculate end date based on current formData
    const calculateEndDate = () => {
      // Ensure start_date is valid before proceeding
      const startDate = parseISO(formData.start_date); // Use parseISO for reliability
      if (!formData.start_date || !isValid(startDate)) {
         setEndDate(''); // Clear end date if start date is invalid
         return;
      }

      // Ensure duration is a positive number
      let monthsToAdd = parseInt(formData.duration, 10);
      if (isNaN(monthsToAdd) || monthsToAdd <= 0) {
          monthsToAdd = 0; // Default to 0 if duration is invalid
      }

      // Adjust months based on subscription type
      switch (formData.subscription_type) {
        case SUBSCRIPTION_TYPES.YEARLY:
          monthsToAdd *= 12;
          break;
        case SUBSCRIPTION_TYPES.QUARTERLY:
          monthsToAdd *= 3;
          break;
        // Default is monthly (monthsToAdd *= 1), no change needed
      }

      if (monthsToAdd > 0) {
          const calculatedEndDate = addMonths(startDate, monthsToAdd);
          setEndDate(format(calculatedEndDate, 'yyyy-MM-dd'));
      } else {
          // If duration results in 0 months, end date is same as start date
          setEndDate(formData.start_date);
      }
    };

    calculateEndDate(); // Run calculation

    // Re-run this effect if these specific fields in formData change
  }, [formData.start_date, formData.duration, formData.subscription_type]);


  // Simplified handleChange, calculation is now handled by useEffect
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Ensure duration is stored as a number if changed
      [name]: name === 'duration' ? parseInt(value, 10) || 0 : value,
    }));
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser submission

    // --- Basic Client-Side Validation ---
    if (!endDate) {
      setError("لا يمكن حساب تاريخ الانتهاء. يرجى التحقق من تاريخ البدء والمدة.");
      return;
    }
    // Add more checks if needed (e.g., for name, email format - though 'required' and 'type="email"' help)


    // --- Submission Logic ---
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      const customerData = {
        ...formData,
        // Ensure duration is definitely a number before sending
        duration: Number(formData.duration),
        end_date: endDate, // Use the calculated end date from state
      };

      // --- Supabase Insert ---
      const { error: insertError } = await supabase
        .from('customers')
        .insert([customerData]); // Send data as an array

      if (insertError) {
        // Throw the specific Supabase error to be caught below
        throw insertError;
      }

      // --- Success ---
      onCustomerAdded(); // Callback for successful addition
      onClose(); // Close the modal

    } catch (err) {
      // --- Error Handling ---
      console.error('Error adding customer:', err);
      // Display specific Supabase error message or a generic one
      setError(err.message || 'حدث خطأ غير متوقع أثناء إضافة العميل. الرجاء المحاولة مرة أخرى.');

    } finally {
      // --- Cleanup ---
      setIsSubmitting(false); // Re-enable submit button
    }
  };

  // --- JSX Structure (mostly unchanged, added comments) ---
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50" dir="rtl">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 my-8"> {/* Added my-8 for vertical margin */}
        {/* Close Button */}
        <div className="absolute left-0 top-0 p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full" // Improved focus style
            aria-label="إغلاق" // Accessibility label
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            إضافة عميل جديد
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto"> {/* Added max-height and scroll */}
          {/* Error Display Area */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200">
              {error}
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
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05xxxxxxxx"
                  />
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
                    id="service"
                    name="service"
                    type="text"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.service}
                    onChange={handleChange}
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
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.subscription_type}
                      onChange={handleChange}
                    >
                      {/* Use constants for values */}
                      <option value={SUBSCRIPTION_TYPES.MONTHLY}>شهري</option>
                      <option value={SUBSCRIPTION_TYPES.QUARTERLY}>ربع سنوي</option>
                      <option value={SUBSCRIPTION_TYPES.YEARLY}>سنوي</option>
                    </select>
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
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      name="end_date" // Added name attribute
                      type="date"
                      readOnly // Use readOnly instead of disabled for calculated fields that should still be associated with the form
                      className="block w-full border-gray-300 bg-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-600" // Adjusted styling for readOnly
                      value={endDate} // Bind directly to endDate state
                      tabIndex={-1} // Prevent tabbing into readOnly field
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting} // Disable cancel during submission too
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !endDate} // Disable if submitting OR if endDate is invalid
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة العميل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}