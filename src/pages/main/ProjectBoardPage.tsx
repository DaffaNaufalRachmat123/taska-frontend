// src/pages/ProjectBoardPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectSpecificSidebar from '../../components/ProjectSpecificSidebar';
import BoardContent from '../../components/BoardContent';
import TaskCreationModal from '../../components/TaskCreationModal';
import { SprintData } from '../../interfaces/sprint-interface';

const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="flex flex-1 overflow-hidden bg-white"> {/* bg-white agar sesuai gambar */}
      <ProjectSpecificSidebar sprintName={projectId || "Project"} />
      <BoardContent projectTitle={projectId ? projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Board" : "Project Board"} />
    </div>
  );
};

export default ProjectBoardPage;