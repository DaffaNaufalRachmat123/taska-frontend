import React from 'react';

interface NavbarProps {
  logo: string;
  notificationCount : number;
  messageCount : number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavbarHeader: React.FC<NavbarProps> = ({ logo, notificationCount , messageCount, open, setOpen }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <img src={logo} alt="Logo" className="w-24 h-auto" />
      <div className="relative">
        <img
          className="h-8 w-8 rounded-full object-cover cursor-pointer peer"
          src={''}
          alt="User Profile"
          tabIndex={0}
        />
        {/* Dropdown menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 peer-focus:opacity-100 transition-opacity duration-300 z-50">
          <div className="px-4 py-2 text-sm font-bold text-gray-900">Welcome!</div>
          <div className="border-t border-gray-200"></div>
          <div className="px-4 py-2 text-sm text-gray-800 font-semibold cursor-pointer flex items-center">
            {notificationCount > 0 && (
              <span style={{ fontSize: notificationCount > 9 ? '7px' : '10px' }} className="absolute bottom-11.5 left-4 inline-flex items-center justify-center px-1 py-0.5 font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
            Notifikasi
          </div>
          <div className="px-4 py-2 text-sm text-gray-800 font-semibold cursor-pointer flex items-center">
            {messageCount > 0 && (
              <span style={{ fontSize: messageCount > 9 ? '7px' : '10px' }} className="absolute bottom-11.5 left-4 inline-flex items-center justify-center px-1 py-0.5 font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {messageCount > 9 ? '9+' : messageCount}
              </span>
            )}
            Pesan
          </div>
          <div className="px-4 py-2 text-sm text-gray-800 cursor-pointer flex items-center">
            Keluar
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbarHeader