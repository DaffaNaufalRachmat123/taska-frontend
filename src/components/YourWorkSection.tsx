// src/components/YourWorkSection.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const YourWorkSection: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClassName = (path: string): string => {
    const baseClasses = "group flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-150";

    if (currentPath === path) {
      return `${baseClasses} font-semibold bg-gray-100 text-gray-900`;
    } else {
      return `${baseClasses} font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900`;
    }
  };

  return (
    <div className="w-64 space-y-6 py-7 px-2 border-r border-gray-200 bg-white h-full overflow-y-auto">
      {/* `h-full overflow-y-auto` ditambahkan agar bisa discroll jika kontennya panjang */}
      <h2 className="text-2xl font-semibold text-gray-800 px-4">Your work</h2>
      <div className="px-4">
      </div>

      <nav className="mt-6 px-2"> {/* px-2 agar lebih pas dengan item nav */}
        <a
          href="/sprint"
          className={getLinkClassName('/sprint')}
        >
          Sprint List
        </a>
        <a
          href="/task"
          className={getLinkClassName('/task')}
        >
          Task List
        </a>
        <a
          href="/task/me"
          className={getLinkClassName('/task/me')}
        >
          Assigned to me
          <span className="ml-auto inline-block py-0.5 px-2.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
            0
          </span>
        </a>
      </nav>
    </div>
  );
};

export default YourWorkSection;