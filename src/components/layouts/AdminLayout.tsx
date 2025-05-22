import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, Route, useLocation, useNavigate } from 'react-router-dom';
import TaskaMainLogo from '../../assets/logo/taska_main_logo.png';
import MobileNavbar from '../MobileNavbar';
import menus from '../../routes/routes';
import MobileNavbarHeader from '../MobileNavbarHeader';
import { FaBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { useAuthStore } from '../../stores/auth/auth.store';

export const AdminLayout = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [activeMenu, setActiveMenu] = useState<string>(menus[0].name);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [notificationCount , setNotificationCount] = useState<number>(0)
  const [mailCount , setMailcount] = useState<number>(0)
  const response = useAuthStore((state) => state.isLoggedIn)
  const profileImageRef = useRef<HTMLImageElement>(null);

  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    if(!response){
      navigate('/auth')
    }
  } , [response])

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
        <div
          className={`bg-[#0e0e0e] min-h-screen ${open ? "w-72" : isMobile ? "w-0" : "w-16"} duration-500 text-gray-100 relative transition-all ${isMobile ? "overflow-hidden" : ""}`}
        >
          {(!isMobile || open) && (
            <div className="flex flex-col justify-center items-center py-3">
              <img
                src={TaskaMainLogo}
                alt="Logo"
                className={`transition-all duration-500 ${open ? "w-32 h-32" : "w-10 h-10"}`}
              />
              {/* {open && (
                <p className="text-center text-sm mt-2">Suberes</p>
              )} */}
            </div>
          )}
          {/* {!isMobile && (
            <div className="absolute top-4 right-[-13px] transform transition-transform duration-500 cursor-pointer" onClick={() => setOpen(!open)}>
              <div className='flex justify-center items-center h-full' style={{ border: '1px solid black', width: '28px', height: '28px', backgroundColor: '#FFFFFF', borderRadius: '50%' }}>
                {open ? <FaChevronLeft size={13} color='#000000' /> : <FaChevronRight size={13} color='#000000' />}
              </div>
            </div>
          )} */}

          {(!isMobile || open) && (
            <div className="mt-4 flex flex-col gap-4 relative">
              {menus?.map((menu, i) => (
                menu.isSidebar ? (
                  <Link
                    to={menu?.link}
                    key={i}
                    className={`${menu?.margin && "mt-5"} group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                    onClick={() => setActiveMenu(menu.name)}
                    style={{ marginLeft: '12.8px' }}
                  >
                    <h2
                      style={{
                        transitionDelay: "100ms",
                      }}
                      className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-35 overflow-hidden"}`}
                    >
                      {menu?.name}
                    </h2>
                    <h2
                      className={`${open && "hidden"} absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-50`}
                    >
                      {menu?.name}
                    </h2>
                  </Link>
                ) : null
              ))}
            </div>
          )}
        </div>
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
                        ref={profileImageRef}
                        className="h-8 w-8 rounded-full object-cover cursor-pointer peer"
                        src={''}
                        alt="User Profile"
                        tabIndex={0}
                      />
                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 peer-focus:opacity-100 transition-opacity duration-300 z-50">
                        <div className="px-4 py-2 text-sm font-bold text-gray-900">Welcome!</div>
                        <div className="border-t border-gray-200"></div>
                        <div className="px-4 py-2 text-sm text-gray-800 cursor-pointer flex items-center">
                          <span className="mr-2">🏃‍♂️</span>
                          Logout
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