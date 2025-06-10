import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import { AuthLoginPage } from './pages/AuthLoginPage';
import { MainLayout } from './pages/main/MainLayout'
import { DashboardPage } from './pages/DashboardPage';
import ProjectBoardPage from './pages/main/ProjectBoardPage';
import { AuthRegisterPage } from './pages/AuthRegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="sprint/:sprintId" element={<ProjectBoardPage />} />
      </Route>
      <Route path="/auth" element={<AuthLoginPage />} />
      <Route path="/auth/register" element={<AuthRegisterPage/>}/>
    </Routes>
  );
}

export default App;
