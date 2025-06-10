import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuthStore } from "../../stores/auth/auth.store";
import { useEffect } from "react";

export const MainLayout= () => {
  const isLoggedIn = useAuthStore((store) => store.isLoggedIn)
  const navigate = useNavigate()
  useEffect(() => {
    if(!isLoggedIn){
      navigate('/auth')
    }
  } , [])
  return (
    <div className="flex flex-col h-screen antialiased text-gray-800">
      <Navbar />
      <Outlet /> {/* Ini akan merender komponen Route yang cocok */}
    </div>
  );
};