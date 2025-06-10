import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import menus from './routes/routes';
import { AuthPage } from './pages/AuthPage';
import { MainLayout } from './pages/main/MainLayout'
import { DashboardPage } from './pages/DashboardPage';
import ProjectBoardPage from './pages/main/ProjectBoardPage';
import SprintPage from './pages/main/SprintPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path='sprint' element={<SprintPage />}/>
          <Route path='board/:sprintId' element={<ProjectBoardPage />} />
          {/* Tambahkan route lain di sini jika perlu */}
        </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
