import React from 'react';
import IcSetting from '../assets/logo/ic_setting.png';

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
          src={IcSetting}
          alt="User Profile"
          tabIndex={0}
        />
        {/* Dropdown menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 peer-focus:opacity-100 transition-opacity duration-300 z-50">
          <div className="px-4 py-2 text-sm font-bold text-gray-900">ホームページへよこそう</div>
          <div className="border-t border-gray-200"></div>
          <div className="px-4 py-2 text-sm text-gray-800 cursor-pointer flex items-center">
            Keluar
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbarHeader