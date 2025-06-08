import { useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import TaskList from "../components/TaskList";
import YourWorkSection from "../components/YourWorkSection";
import { useSprintStore } from "../stores/auth/sprint.store";
import { SprintData } from "../interfaces/sprint-interface";

export const DashboardPage: React.FC = () => {
      const getSprint = useSprintStore((state) => state.currentSprint);
      const resetState = useSprintStore((state) => state.resetState)
      const response = useSprintStore((state) => state.currSprintState);

      useEffect(() => {
        if(!response.type || response.type === 'Idle') {
            getSprint();
        }

        console.log(response)
      } , [response.type])



  return (
    <div className="flex flex-1 overflow-hidden">
      <YourWorkSection />
      <main className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {response.type === 'Success' && (
              <ProjectCard
                sprint={response.data?.data as SprintData}
              />
            )}
          </div>
        </div>
        {
          response.type === 'Success' && (
            <TaskList sprint_id={response.data?.data.id as string} sprint_name={response.data?.data.name as string} />
          )
        }
      </main>
    </div>
  );
};