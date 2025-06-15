// src/pages/ProjectBoardPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectSpecificSidebar from '../../components/ProjectSpecificSidebar';
import BoardContent from '../../components/BoardContent';
import TaskCreationModal from '../../components/TaskCreationModal';
import { SprintData } from '../../interfaces/sprint-interface';
import Navbar from '../../components/Navbar';

const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    // <div className="flex flex-col h-screen antialiased text-gray-800 bg-gray-50">
    //   <Navbar/>
      
    //   {/* This container holds the sidebar and main content, filling the remaining space */}
    //   <div className="flex flex-1 overflow-hidden">
    //     <ProjectSpecificSidebar sprintName={"Software project"} />
        
    //     {/* The main content area. By using overflow-auto, it can scroll in any direction. */}
    //     <main className="flex-1 overflow-auto bg-white p-6">
    //       <BoardContent projectTitle={projectId ? projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Board" : "Project Board"}  />
    //     </main>
    //   </div>
    // </div>
    <div className="flex flex-col h-screen antialiased text-gray-800">
      <Navbar/>
      <div className="flex flex-1 overflow-hidden">
        <ProjectSpecificSidebar sprintName={"Software project"} />
        <main className="flex-1 overflow-auto bg-white p-6">
          <BoardContent projectTitle={projectId ? projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Board" : "Project Board"}  />
        </main>
      </div>
    </div>
  );
};

export default ProjectBoardPage;