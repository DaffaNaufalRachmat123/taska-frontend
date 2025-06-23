// src/components/YourWorkSection.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/auth/user.store';

const YourWorkSection: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const data = useUserStore((store) => store.meState)

  // This function now correctly highlights the active link, including nested routes.
  const getLinkClassName = (path: string): string => {
    const baseClasses = "group flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-150";
    
    // Check if the current path starts with the link's path to handle active state for nested routes
    if (currentPath.startsWith(path)) {
      return `${baseClasses} font-semibold bg-gray-100 text-gray-900`;
    } else {
      return `${baseClasses} font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900`;
    }
  };

  return (
    // Added flex-shrink-0 to prevent the sidebar from shrinking on smaller viewports
    <div className="w-64 flex-shrink-0 space-y-6 py-7 px-2 border-r border-gray-200 bg-white h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 px-4">Your work</h2>
      
      {/* Navigation links updated to use React Router's Link component */}
      <nav className="mt-6 px-2 space-y-1">
        <Link
          to="/"
          className={getLinkClassName("/dashboard")}
        >
          Dashboard
        </Link>
        <Link
          to="/sprint"
          className={getLinkClassName('/sprint')}
        >
          Sprint List
        </Link>
      </nav>
    </div>
  );
};

export default YourWorkSection;
