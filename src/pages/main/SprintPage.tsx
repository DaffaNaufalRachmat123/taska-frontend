// src/pages/SprintPage.tsx
import React, { useEffect, useState } from 'react';
import YourWorkSection from '../../components/YourWorkSection';
import ProjectCard from '../../components/ProjectCard';
import { useSprintStore } from '../../stores/auth/sprint.store';
import { useTaskStore } from '../../stores/auth/task.store';


const SprintPage: React.FC = () => {
    const sprintList = useSprintStore((state) => state.sprintListState);
    const getSprintlist = useSprintStore((state) => state.sprintList);
    const resetTaskState = useTaskStore((state) => state.resetState);

    useEffect(() => {
        if (!sprintList.type || sprintList.type === 'Idle') {
            getSprintlist();
        }
    }
    , [sprintList.type, getSprintlist]);

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const handleToggleDropdown = (sprintId: string) => {
        setOpenDropdownId(prevId => (prevId === sprintId ? null : sprintId));
        resetTaskState();
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
                            sprint={sprint}
                            isDropdownOpen={openDropdownId === sprint.id}
                            onToggleDropdown={handleToggleDropdown}
                        />
                    ))}
            </div>
            </div>
        </main>
        </div>
    );
};

export default SprintPage;