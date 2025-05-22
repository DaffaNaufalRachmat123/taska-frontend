import React from 'react';
import menus from '../routes/routes';
import { Link } from "react-router-dom";

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}

const MobileNavbar: React.FC<ModalProps> = ({ open, setOpen, activeMenu, setActiveMenu }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md max-h-screen overflow-auto p-8 rounded-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-600"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <div className="flex flex-col gap-4 mt-8">
          {menus.map((menu, i) => (
            menu.isSidebar ? (
              <Link
                to={menu.link}
                key={i}
                className={`flex items-center text-sm gap-3.5 font-medium p-2 rounded-md transition-colors ${activeMenu === menu.name ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                onClick={() => {
                  setActiveMenu(menu.name);
                  setOpen(false);
                }}
              >
                {menu.name}
              </Link>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
