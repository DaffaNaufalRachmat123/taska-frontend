// src/pages/ProjectBoardPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectSpecificSidebar from '../../components/ProjectSpecificSidebar'; // Akan kita buat
import BoardContent from '../../components/BoardContent'; // Akan kita buat

const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Mengambil projectId dari URL

  // Anda bisa menggunakan projectId untuk fetch data spesifik proyek nantinya
  // console.log("Current Project ID:", projectId);

  return (
    <div className="flex flex-1 overflow-hidden bg-white"> {/* bg-white agar sesuai gambar */}
      <ProjectSpecificSidebar sprintName={projectId || "Project"} />
      <BoardContent projectTitle={projectId ? projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Board" : "Project Board"} />
    </div>
  );
};

export default ProjectBoardPage;