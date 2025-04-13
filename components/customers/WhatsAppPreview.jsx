// components/customers/WhatsAppPreview.jsx
import { format, isToday, isYesterday } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function WhatsAppPreview({ message, timestamp, unread }) {
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: ar });
    } else if (isYesterday(date)) {
      return 'الأمس';
    } else {
      return format(date, 'dd/MM/yyyy', { locale: ar });
    }
  };

  // No display if there's no message
  if (!message || message === 'لا توجد رسائل سابقة') {
    return null;
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100 transition-all hover:border-green-200 hover:bg-green-50 cursor-pointer group">
      <div className="flex items-start justify-between">
        {/* WhatsApp Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white" 
              viewBox="0 0 30 30"
              fill="currentColor"
            >
              <path 
                d="M15,3C8.373,3,3,8.373,3,15c0,2.016,0.507,3.921,1.395,5.587L3.044,27l6.523-1.34C11.927,26.52,13.93,27,16,27  c6.627,0,12-5.373,12-12S21.627,3,15,3z M21.95,19.41c-0.354,0.999-1.752,1.826-2.864,2.068c-0.76,0.164-1.751,0.294-5.094-1.094  c-4.282-1.777-7.033-6.11-7.245-6.386c-0.198-0.276-1.664-2.214-1.664-4.223c0-2.008,1.057-2.991,1.428-3.399  c0.354-0.398,0.771-0.497,1.024-0.497c0.249,0,0.502,0,0.721,0.015c0.253,0.015,0.577-0.097,0.907,0.689  c0.337,0.801,1.142,2.774,1.239,2.974c0.099,0.2,0.164,0.433,0.05,0.693c-0.116,0.262-0.175,0.425-0.34,0.65  c-0.166,0.224-0.349,0.5-0.5,0.672c-0.166,0.193-0.34,0.398-0.144,0.773c0.193,0.374,0.868,1.594,1.866,2.58  c1.279,1.267,2.358,1.657,2.69,1.84c0.332,0.183,0.523,0.153,0.713-0.083c0.191-0.237,0.819-0.955,1.037-1.282  c0.216-0.323,0.432-0.27,0.729-0.163c0.295,0.106,1.869,0.88,2.192,1.04c0.322,0.16,0.536,0.238,0.615,0.37  C22.307,17.581,22.304,18.411,21.95,19.41z" 
              />
            </svg>
          </div>
        </div>
        
        {/* Message Content */}
        <div className="flex-1 mr-3">
          <div className="flex items-start justify-between">
            <div className="text-sm font-medium text-gray-900 flex items-center">
              رسالة واتساب
              {unread && (
                <span className="mr-2 w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {formatMessageTime(timestamp)}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-1 group-hover:line-clamp-none transition-all">
            {message}
          </p>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="mt-2 flex justify-end">
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          الرد السريع
        </button>
      </div>
    </div>
  );
}