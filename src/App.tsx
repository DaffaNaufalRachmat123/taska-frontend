import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import { AuthLoginPage } from './pages/AuthLoginPage';
import { MainLayout } from './pages/main/MainLayout'
import { DashboardPage } from './pages/main/DashboardPage';
import ProjectBoardPage from './pages/main/ProjectBoardPage';
import { AuthRegisterPage } from './pages/AuthRegisterPage';
import SprintPage from './pages/main/SprintPage';
import TaskDetailPage from './pages/main/TaskDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="sprint" element={<SprintPage />}/>
          <Route path="task/:id" element={<TaskDetailPage />} />
      </Route>
      <Route path='board/:sprintId' element={<ProjectBoardPage />} />
      <Route path="/auth" element={<AuthLoginPage />} />
      <Route path="/auth/register" element={<AuthRegisterPage/>}/>
    </Routes>
  );
}

export default App;
