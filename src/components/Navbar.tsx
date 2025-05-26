// src/components/Navbar.tsx
import React, { Fragment } from 'react'; // Tambahkan Fragment
import { Menu, Transition } from '@headlessui/react'; // Impor dari Headless UI
import {
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon, // Untuk "Manage account"
  ChevronRightIcon,         // Untuk "Theme"
} from '@heroicons/react/20/solid'; // Menggunakan 20/solid untuk ikon yang lebih kecil di dropdown

const Navbar: React.FC = () => {
  // Data pengguna (bisa datang dari props atau context nantinya)
  const user = {
    name: 'Daffa',
    email: 'daffarachmatnaufal@gmail.com',
    avatarChar: 'D',
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        {/* Logo and Main Navigation */}
        <div className="flex items-center space-x-4">
          <div className="text-blue-600 font-bold text-xl">Jira</div>
          {/* ... (menu navigasi lainnya tetap sama) ... */}
          <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Your work</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">Projects <ChevronDownIcon className="h-5 w-5 ml-1" /></a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Create
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search, Help, Notifications */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 sm:text-sm"
          />
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <QuestionMarkCircleIcon className="h-6 w-6" />
        </button>

        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex text-sm bg-yellow-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.avatarChar}
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
              {/* Account Section */}
              <div className="px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account</p>
                <div className="mt-3 flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.avatarChar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Log out Section */}
              <div className="border-t border-gray-200 pt-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100`}
                    >
                      Log out
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;