import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuthStore } from "../../stores/auth/auth.store";
import { useEffect } from "react";
import YourWorkSection from "../../components/YourWorkSection";

export const MainLayout = () => {
  const isLoggedIn = useAuthStore((store) => store.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]); // Dependencies for the effect

  return (
    <div className="flex flex-col h-screen antialiased text-gray-800 bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <YourWorkSection />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};