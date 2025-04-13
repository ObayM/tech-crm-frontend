"use client";

export default function CustomerListSkeleton() {
  // Create an array of 5 items for skeleton loading
  const skeletonItems = Array(5).fill(null);
  
  return (
    <div className="animate-pulse">
      <div className="divide-y divide-gray-100">
        {skeletonItems.map((_, index) => (
          <div key={index} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* Avatar Skeleton */}
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                
                {/* Name & Details Skeleton */}
                <div className="space-y-2">
                  <div className="h-5 w-36 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              {/* Mobile: Action buttons */}
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
                {/* Service Skeleton */}
                <div className="flex items-center">
                  <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
                </div>
                
                {/* Status Skeleton */}
                <div className="flex items-center">
                  <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                </div>
                
                {/* Actions Skeleton */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Additional Details Skeleton */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-6 w-full bg-gray-200 rounded"></div>
              <div className="h-6 w-full bg-gray-200 rounded"></div>
              <div className="h-6 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}