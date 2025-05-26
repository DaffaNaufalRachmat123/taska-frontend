import ProjectCard from "../components/ProjectCard";
import TaskList from "../components/TaskList";
import YourWorkSection from "../components/YourWorkSection";

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <YourWorkSection />
      <main className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectCard
              projectId="chatbot-customer-support" // Tambahkan ID proyek
              projectName="Chatbot for Customer Su..."
              projectType="Team-managed software"
              openWorkItemsCount={0}
            />
            <ProjectCard
              projectId="project-alpha" // Tambahkan ID proyek
              projectName="Project Alpha"
              projectType="Kanban project"
              openWorkItemsCount={12}
            />
          </div>
        </div>
        <TaskList />
      </main>
    </div>
  );
};