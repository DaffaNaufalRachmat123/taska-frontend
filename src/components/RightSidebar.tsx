// src/components/RightSidebar.tsx
import React from 'react';

const RightSidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white p-6 border-l border-gray-200 hidden lg:block h-full overflow-y-auto">
      {/* Ilustrasi Placeholder */}
      <div className="h-32 bg-yellow-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
         <span className="text-sm text-center p-2">[Idea 💡 → Epic 🌠 illustration placeholder]</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">
        Jira Product Discovery
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        Build the right features, the right way. Prioritize your ideas then
        easily move them into delivery, without losing any details on the way.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 w-full sm:w-auto">
          Try it now
        </button>
        <button className="bg-transparent text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 border border-blue-600 hover:border-blue-700 w-full sm:w-auto">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;