import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, Route, useLocation, useNavigate } from 'react-router-dom';
import TaskaMainLogo from '../../assets/logo/taska_main_logo.png';
import IcSetting from '../../assets/logo/ic_setting.png';
import MobileNavbar from '../MobileNavbar';
import menus from '../../routes/routes';
import MobileNavbarHeader from '../MobileNavbarHeader';
import { IoMail } from 'react-icons/io5';
import { useAuthStore } from '../../stores/auth/auth.store';

export const AdminLayout = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [activeMenu, setActiveMenu] = useState<string>(menus[0].name);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [notificationCount, setNotificationCount] = useState<number>(0)
  const [mailCount, setMailcount] = useState<number>(0)
  const response = useAuthStore((state) => state.isLoggedIn)
  const profileImageRef = useRef<HTMLImageElement>(null);

  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    if (!response) {
      navigate('/auth')
    }
  }, [response])

  useEffect(() => {
    const currentMenu = menus.find(menu => menu.link === location.pathname);
    if (currentMenu) {
      setActiveMenu(currentMenu.name);
    }
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="flex flex-col min-h-screen">
      {/* Navbar */}
      {isMobile && (
        <MobileNavbarHeader
          logo={TaskaMainLogo}
          notificationCount={notificationCount}
          messageCount={mailCount}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
      <div className='flex flex-1'>
        
        <div style={{ width: '100%' }} className="m-3 text-xl text-gray-900 font-semibold">
          <div className="relative min-h-screen bg-gray-100 p-8">
            <div className="absolute top-0 left-0 w-full h-[9%] sm:h-[10%] lg:h-[20%]" style={{ backgroundColor: '#1b2e5c' }}></div>
            {!isMobile && (
              <nav className="bg-white border-b border-gray-200">
                <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-0">
                  <div className="relative flex items-center justify-between h-16">
                    <div className="flex items-center">
                      <span className="text-base font-bold text-white">{activeMenu}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-end pr-6 space-x-4">
                      <div className="relative">
                        {notificationCount > 0 && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        {mailCount > 0 && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                            {mailCount > 9 ? '9+' : mailCount}
                          </span>
                        )}
                      </div>
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
                  </div>
                </div>
              </nav>
            )}
            <Outlet />
          </div>
        </div>
      </div>
      <MobileNavbar open={modalOpen} setOpen={setModalOpen} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </section>
  );
}