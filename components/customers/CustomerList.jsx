// components/customers/CustomerList.jsx
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import CustomerActions from './CustomerActions';
import WhatsAppPreview from './WhatsAppPreview';

export default function CustomerList({ customers, onRenew, onEdit, onDelete, onChat }) {
  const getStatusBadgeClass = (remainingDays) => {
    if (remainingDays <= 0) return "bg-red-100 text-red-800";
    if (remainingDays <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (  
    <div className="divide-y divide-gray-100">
      {customers.map((customer) => (
        <div key={customer.id} className="hover:bg-gray-50">
          {/* Customer Card */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              {/* Customer Info */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">{customer.name[0]}</span>
                </div>
                <div className="mr-4 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="text-base font-medium text-gray-900">{customer.name}</div>
                    <span className="hidden md:block mx-2 text-gray-300">•</span>
                    <div className="text-sm text-gray-500 mt-1 md:mt-0">
                      عميل منذ {format(new Date(customer.created_at), 'dd MMMM yyyy', { locale: ar })}
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 sm:space-x-reverse">
                    <div className="text-sm text-gray-600">{customer.email}</div>
                    <div className="text-sm text-gray-600 flex items-center mt-1 sm:mt-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {customer.phone}
                    </div>
                  </div>
                  
                  {/* Subscription Info */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                        {customer.service} - {customer.subscription_type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-3 space-x-reverse">
                      <div>من: {format(new Date(customer.start_date), 'dd/MM/yyyy')}</div>
                      <div>إلى: {format(new Date(customer.end_date), 'dd/MM/yyyy')}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Badge - Mobile-friendly placement */}
              <div className="mt-3 md:mt-0 md:ml-4">
                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(customer.remainingDays)}`}>
                  {customer.remainingDays > 0 
                    ? `${customer.remainingDays} يوم متبقي` 
                    : 'منتهي'}
                </span>
              </div>
            </div>
            
          
            
            {/* Actions */}
            <div className="mt-4 flex justify-end">
              <CustomerActions 
                customer={customer}
                onRenew={() => onRenew(customer)}
                onEdit={() => onEdit(customer)}
                onDelete={() => onDelete(customer)}
                onChat={() => onChat(customer)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}