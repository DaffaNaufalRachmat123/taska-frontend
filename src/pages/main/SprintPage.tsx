// src/pages/SprintPage.tsx
import React, { useEffect, useState } from 'react';
import YourWorkSection from '../../components/YourWorkSection';
import ProjectCard from '../../components/ProjectCard';
import { useSprintStore } from '../../stores/auth/sprint.store';
import { useTaskStore } from '../../stores/auth/task.store';
import TaskCreationModal from '../../components/TaskCreationModal';
import { TaskFormData } from '../../interfaces/task-interface';
import { SprintData } from '../../interfaces/sprint-interface';


const SprintPage: React.FC = () => {
    const sprintList = useSprintStore((state) => state.sprintListState);
    const getSprintlist = useSprintStore((state) => state.sprintList);
    const resetTaskState = useTaskStore((state) => state.resetState);

    const createTask = useTaskStore((state) => state.createTask);
    const createTaskState = useTaskStore((state) => state.createTaskState);
    const getTask = useTaskStore((state) => state.task);

    useEffect(() => {
        if (!sprintList.type || sprintList.type === 'Idle') {
            getSprintlist();
        }
    }
    , [sprintList.type, getSprintlist, getTask]);

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const handleToggleDropdown = (sprintId: string) => {
        setOpenDropdownId(prevId => (prevId === sprintId ? null : sprintId));
        resetTaskState();
    };

    // ✨ State for the Task Modal ✨
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to hold the sprint ID for the new task
    const [sprintForNewTask, setSprintForNewTask] = useState<SprintData | null>(null);

    // ✨ Handler to open the modal ✨
    const handleOpenAddTaskModal = (sprint: SprintData) => {
        setSprintForNewTask(sprint);
        setIsModalOpen(true);
    };

    // ✨ Handler to close the modal ✨
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSprintForNewTask(null);
    };

    // ✨ Handler to submit the new task ✨
    const handleSubmitTask = async (taskData: TaskFormData) => {
        await createTask(taskData);

        // Optionally, you can refresh the task list for the sprint
        if (sprintForNewTask) {
            getTask(sprintForNewTask.id);
        }

        handleCloseModal();
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <YourWorkSection />
            <main className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
                <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {
                        sprintList.type === 'Success' && sprintList.data?.data.map((sprint) => (
                            <ProjectCard
                                key={sprint.id}
                                sprint={sprint}
                                isDropdownOpen={openDropdownId === sprint.id}
                                onToggleDropdown={handleToggleDropdown}
                                onAddTask={handleOpenAddTaskModal}
                            />
                        ))}
                </div>
                </div>
            </main>
            <TaskCreationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitTask}
                sprint={sprintForNewTask}
            />
        </div>
    );
};

export default SprintPage;