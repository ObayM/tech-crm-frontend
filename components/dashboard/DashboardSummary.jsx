"use client";
import { useState } from 'react';

export default function DashboardSummary({ totalCustomers, activeCustomers, expiredCustomers }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">نظرة عامة على العملاء</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Customers Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي العملاء</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalCustomers}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-1 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          {/* Active Customers Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-600">اشتراكات نشطة</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{activeCustomers}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-green-100 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-1 rounded-full" 
                style={{ width: totalCustomers > 0 ? `${(activeCustomers / totalCustomers) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          {/* Expired Customers Card */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-600">اشتراكات منتهية</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{expiredCustomers}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-red-100 rounded-full overflow-hidden">
              <div 
                className="bg-red-500 h-1 rounded-full" 
                style={{ width: totalCustomers > 0 ? `${(expiredCustomers / totalCustomers) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}