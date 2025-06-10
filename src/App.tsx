import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import { AuthLoginPage } from './pages/AuthLoginPage';
import { MainLayout } from './pages/main/MainLayout'
import { DashboardPage } from './pages/DashboardPage';
import ProjectBoardPage from './pages/main/ProjectBoardPage';
<<<<<<< HEAD
import { AuthRegisterPage } from './pages/AuthRegisterPage';
=======
import SprintPage from './pages/main/SprintPage';
>>>>>>> master

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/" element={<MainLayout />}>
<<<<<<< HEAD
        <Route index element={<DashboardPage />} />
        <Route path="sprint/:sprintId" element={<ProjectBoardPage />} />
      </Route>
      <Route path="/auth" element={<AuthLoginPage />} />
      <Route path="/auth/register" element={<AuthRegisterPage/>}/>
=======
          <Route index element={<DashboardPage />} />
          <Route path='sprint' element={<SprintPage />}/>
          <Route path='board/:sprintId' element={<ProjectBoardPage />} />
          {/* Tambahkan route lain di sini jika perlu */}
        </Route>
      <Route path="/auth" element={<AuthPage />} />
>>>>>>> master
    </Routes>
  );
}

export default App;
