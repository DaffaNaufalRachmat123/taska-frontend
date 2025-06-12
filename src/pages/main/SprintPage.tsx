// src/pages/SprintPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/solid'; // Pastikan Anda sudah install @heroicons/react

// Import komponen dan store Anda
import YourWorkSection from '../../components/YourWorkSection';
import ProjectCard from '../../components/ProjectCard';
import { useSprintStore } from '../../stores/auth/sprint.store';
import { useTaskStore } from '../../stores/auth/task.store';
import CreateSprintModal from '../../components/CreateSprintModal';
import { useAuthStore } from '../../stores/auth/auth.store';

const SprintPage: React.FC = () => {
    // Hooks untuk navigasi dan state management
    const navigate = useNavigate();
    const sprintList = useSprintStore((state) => state.sprintListState);
    const getSprintlist = useSprintStore((state) => state.sprintList);
    const resetTaskState = useTaskStore((state) => state.resetState);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const role = useAuthStore((store) => store.role)

    useEffect(() => {
        if (!sprintList.type || sprintList.type === 'Idle') {
            getSprintlist();
        }
    }, [sprintList.type, getSprintlist]);

    const handleToggleDropdown = (sprintId: string) => {
        setOpenDropdownId(prevId => (prevId === sprintId ? null : sprintId));
        resetTaskState();
    };

    const handleCreateSprint = () => {

    };

    const renderSprintContent = () => {
        switch (sprintList.type) {
            case 'Loading':
            case 'Idle':
                return <p className="text-center text-gray-500">Loading sprints...</p>;
            
            case 'Failed':
                return <p className="text-center text-red-500">Gagal memuat sprint. Silakan coba lagi.</p>;
            
            case 'Success':
                if (sprintList.data?.data.length === 0) {
                    return (
                        <div className="text-center text-gray-500">
                            <p>Belum ada sprint yang dibuat.</p>
                            <p>Silakan buat sprint pertama Anda.</p>
                        </div>
                    );
                }
                return sprintList.data?.data.map((sprint) => (
                    <ProjectCard
                        key={sprint.id}
                        sprint={sprint}
                        isDropdownOpen={openDropdownId === sprint.id}
                        onToggleDropdown={handleToggleDropdown}
                    />
                ));

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <YourWorkSection />
            {/* Area Konten Utama */}
            <main className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto relative">
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        {renderSprintContent()}
                    </div>
                </div>

                <CreateSprintModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    isLoading={true}
                    onSubmit={() => {}}
                />

                {/* Tombol Aksi Mengambang (Floating Action Button) */}
                {role == 'admin' && (
                    <div className="group fixed bottom-8 right-8 z-50 flex items-center">
                        {/* Tooltip yang akan muncul */}
                        <div className="mr-4 whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
                            Create Sprint
                        </div>

                        {/* Tombol Aksi Mengambang (Floating Action Button) */}
                        <button
                            onClick={openModal}
                            title="Create New Sprint"
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <PlusIcon className="h-7 w-7" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SprintPage;