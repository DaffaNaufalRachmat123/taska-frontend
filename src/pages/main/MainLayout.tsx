import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuthStore } from "../../stores/auth/auth.store";
import { useEffect } from "react";
import YourWorkSection from "../../components/YourWorkSection";

export const MainLayout = () => {
  const isLoggedIn = useAuthStore((store) => store.isLoggedIn);
  const navigate = useNavigate();

  // Effect to protect routes and redirect to the login page if not authenticated.
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]); // Dependencies for the effect

  return (
    <div className="flex flex-col h-screen antialiased text-gray-800 bg-gray-50">
      <Navbar />
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component */}
        <YourWorkSection />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* Renders the matched nested route component */}
        </main>
      </div>
    </div>
  );
};