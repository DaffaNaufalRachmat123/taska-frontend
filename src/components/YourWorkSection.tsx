// src/components/YourWorkSection.tsx
import React from 'react';

const YourWorkSection: React.FC = () => {
  return (
    <div className="w-64 space-y-6 py-7 px-2 border-r border-gray-200 bg-white h-full overflow-y-auto">
      {/* `h-full overflow-y-auto` ditambahkan agar bisa discroll jika kontennya panjang */}
      <h2 className="text-2xl font-semibold text-gray-800 px-4">Your work</h2>
      <div className="px-4">
      </div>

      <nav className="mt-6 px-2"> {/* px-2 agar lebih pas dengan item nav */}
        <a
          href="#"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
        >
          Sprint List
        </a>
        <a
          href="#"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
        >
          Task List
        </a>
        <a
          href="#"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
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