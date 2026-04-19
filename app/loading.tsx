export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Logo/Icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l8-5v2zm-4 6h-4v4h4v-4z"/>
            </svg>
          </div>
        </div>
        
        <h2 className="mt-6 text-xl font-semibold text-gray-900">Loading AI Trip Planner</h2>
        <p className="mt-2 text-gray-600">Preparing your travel experience...</p>
        
        {/* Loading skeleton cards */}
        <div className="mt-8 space-y-4 max-w-md mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
