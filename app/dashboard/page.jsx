"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { differenceInDays } from 'date-fns';
import Link from 'next/link';

import Header from '@/components/dashboard/Header';
import CustomerList from '@/components/customers/CustomerList';
import CustomerEmptyState from '@/components/customers/CustomerEmptyState';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import CustomerListSkeleton from '@/components/skeletons/CustomerListSkeleton';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import AddCustomerModal from '@/components/modals/AddCustomerModal';
import RenewSubscriptionModal from '@/components/modals/RenewSubscriptionModal';
import DeleteCustomerModal from '@/components/modals/DeleteCustomerModal';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);



export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'expired'
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Calculate remaining days for each customer and add mock WhatsApp messages
      const customersWithRemainingDays = data?.map(customer => {
        const today = new Date();
        const endDate = new Date(customer.end_date);
        const remainingDays = differenceInDays(endDate, today);
        

        
        return {
          ...customer,
          remainingDays,
        };
      }) || [];

      setCustomers(customersWithRemainingDays);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRenewSubscription = (customer) => {
    setSelectedCustomer(customer);
    setIsRenewModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    // Implement edit functionality here
    console.log("Edit customer:", customer);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleChatWithCustomer = (customer) => {
    // Implement routing to chat page
    console.log("Chat with customer:", customer);
    window.location.href = `/chat/${customer.phone}`;
  };


  const filteredCustomers = customers.filter(customer => {
    // Filter by search term
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.service?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && customer.remainingDays > 0;
    if (activeTab === 'expired') return matchesSearch && customer.remainingDays <= 0;
    
    return matchesSearch;
  });



  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* Main Content */}
      <div className="transition-all duration-300">
        <Header 
          title="قائمة العملاء" 
          onAddCustomer={() => setIsAddModalOpen(true)}
        />

        <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm mb-6">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Tabs */}
                <div className="flex space-x-1 space-x-reverse overflow-x-auto scrollbar-hide py-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeTab === 'all' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    جميع العملاء
                  </button>
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeTab === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    اشتراكات نشطة
                  </button>
                  <button
                    onClick={() => setActiveTab('expired')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeTab === 'expired' 
                        ? 'bg-red-100 text-red-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    اشتراكات منتهية
                  </button>
                </div>
                
                {/* Search */}
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* Chats Button */}
                  <Link className='p-4 w-1/1' href="/chats">
                  <button
                    className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-full transition-colors"
                  >
                    صفحة المحادثات
                  </button>
                  </Link>
                  
                  <div className="relative max-w-xs w-full">
                    <input
                      type="text"
                      className="pr-10 pl-4 py-3 w-full border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="بحث عن عميل..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer List or Loading State */}
            {isLoading ? (
              <CustomerListSkeleton />
            ) : (
              filteredCustomers.length > 0 ? (
                <CustomerList 
                  customers={filteredCustomers} 
                  onRenew={handleRenewSubscription}
                  onEdit={handleEditCustomer}
                  onDelete={handleDeleteCustomer}
                  onChat={handleChatWithCustomer}
                />
              ) : (
                <CustomerEmptyState 
                  searchTerm={searchTerm} 
                  onAddCustomer={() => setIsAddModalOpen(true)} 
                />
              )
            )}
          </div>

          {/* Dashboard Stats Summary */}
          <DashboardSummary 
            totalCustomers={customers.length}
            activeCustomers={customers.filter(c => c.remainingDays > 0).length}
            expiredCustomers={customers.filter(c => c.remainingDays <= 0).length}
          />

          {/* Floating Action Button for Chats - Mobile Only */}
          <div className="fixed bottom-24 left-6 md:hidden z-20">
            <Link href="/chats">
            <button 
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all"
              aria-label="محادثات"
            >
              محادثات
            </button>
            </Link>
          </div>
        </main>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      {/* Modals */}
      {isAddModalOpen && (
        <AddCustomerModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)} 
          onCustomerAdded={fetchCustomers}
        />
      )}

      {isRenewModalOpen && selectedCustomer && (
        <RenewSubscriptionModal
          customer={selectedCustomer}
          onClose={() => {
            setIsRenewModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSubscriptionRenewed={fetchCustomers}
        />
      )}

      {isDeleteModalOpen && selectedCustomer && (
        <DeleteCustomerModal
          customer={selectedCustomer}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCustomer(null);
          }}
          onCustomerDeleted={fetchCustomers}
        />
      )}
    </div>
  );
}