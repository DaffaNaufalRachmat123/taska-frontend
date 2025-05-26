import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export const MainLayout= () => {
  return (
    <div className="flex flex-col h-screen antialiased text-gray-800">
      <Navbar />
      <Outlet /> {/* Ini akan merender komponen Route yang cocok */}
    </div>
  );
};