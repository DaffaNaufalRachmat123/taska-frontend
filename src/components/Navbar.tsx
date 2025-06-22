// src/components/Navbar.tsx
import React, { Fragment } from 'react'; // Tambahkan Fragment
import { Menu, Transition } from '@headlessui/react'; // Impor dari Headless UI
import {
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/auth/auth.store';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/auth/user.store';
import { useOrganizationStore } from '../stores/auth/organization.store';

const Navbar: React.FC = () => {
  const logout = useAuthStore((store) => store.logout)
  const navigate = useNavigate()

  const getLoggedInUser = useUserStore((store) => store.me);
  const me = useUserStore((store) => store.meState);

  const getOrganization = useOrganizationStore((store) => store.org);
  const org = useOrganizationStore((store) => store.orgState);
  const isLoggedIn = useAuthStore((store) => store.isLoggedIn)


  React.useEffect(() => {
    if(!isLoggedIn){
      navigate('/auth')
    } else {
      getLoggedInUser()
      getOrganization()
    }
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        {/* Logo and Main Navigation */}
        <div className="flex items-center space-x-4">
          <div className="text-blue-600 font-bold text-xl">Taska</div>
          {/* ... (menu navigasi lainnya tetap sama) ... */}
          <div className="text-gray-600 font-medium">
          {org.type === 'Success' ? org?.data?.data.name : 'Loading...'}
        </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Profile dropdown */}
        { me.type === 'Success' && (
          <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex text-sm bg-yellow-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {me?.data?.data.name.charAt(0).toUpperCase()}
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
                    {me?.data?.data.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{me?.data?.data.name}</p>
                    <p className="text-xs text-gray-500 truncate">{me?.data?.data.email}</p>
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
                      onClick={() => {
                        logout()
                        navigate('/auth')
                      }}
                    >
                      Log out
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;