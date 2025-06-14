// src/pages/SprintPage.tsx
import React, { useEffect, useState } from 'react';
import YourWorkSection from '../../components/YourWorkSection';
import ProjectCard from '../../components/ProjectCard';
import { useSprintStore } from '../../stores/auth/sprint.store';
import { useTaskStore } from '../../stores/auth/task.store';
import TaskCreationModal from '../../components/TaskCreationModal';
import { TaskFormData } from '../../interfaces/task-interface';
import { SprintData } from '../../interfaces/sprint-interface';
import { ErrorContainer } from '../../components/ErrorContainer';
import { ModalToast } from '../../components/ModalToast';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const SprintPage: React.FC = () => {
    const sprintList = useSprintStore((state) => state.sprintListState);
    const getSprintlist = useSprintStore((state) => state.sprintList);
    
    const resetTaskState = useTaskStore((state) => state.resetState);

    const createSprintState = useSprintStore((store) => store.createSprintState)
    const createSprint = useSprintStore((store) => store.createSprint)

    const [createSprintLoading , setCreateSprintLoading] = useState<boolean>(false)

    const createTask = useTaskStore((state) => state.createTask);
    const getTask = useTaskStore((state) => state.task);

    const [modalToast, setModalToast] = useState({
        show: false,
        message: '',
        type: null as 'success' | 'error' | null,
    });

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sprintForNewTask, setSprintForNewTask] = useState<SprintData | null>(null);

    const [isCreateModalOpen, setCreateModalOpen] = useState(false)

    const handleOpenAddTaskModal = (sprint: SprintData) => {
        setSprintForNewTask(sprint);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSprintForNewTask(null);
    };

    const handleSubmitTask = async (taskData: TaskFormData) => {
        await createTask(taskData);

        if (sprintForNewTask) {
            getTask(sprintForNewTask.id);
        }

        handleCloseModal();
    };

    const buildProjectCard = () => {
        switch (sprintList.type) {
            case 'Loading':
                return (
                    <>
                        <SprintCardSkeleton/>
                        <SprintCardSkeleton/>
                        <SprintCardSkeleton/>
                    </>
                )
            case 'Success':
                return (
                    sprintList.data?.data.map((sprint) => (
                        <ProjectCard
                            key={sprint.id}
                            sprint={sprint}
                            isDropdownOpen={openDropdownId === sprint.id}
                            onToggleDropdown={handleToggleDropdown}
                            onAddTask={handleOpenAddTaskModal}
                        />
                    ))
                )
            case 'Failed':
                return (
                    <ErrorContainer onRetry={() => {
                        getSprintlist()
                    }} />
                )
        }
    }

    useEffect(() => {
        if (modalToast.show) {
            const timer = setTimeout(() => {
                setModalToast(prev => ({ ...prev, show: false }));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [modalToast.show]);

    useEffect(() => {
        switch(createSprintState.type){
            case 'Loading':
                setCreateSprintLoading(true)
                break;
            case 'Success':
                setCreateSprintLoading(false)
                setCreateModalOpen(false)
                setModalToast({ show: true, message: 'Berhasil membuat sprint', type: 'success' });
                getSprintlist()
                break
            case 'Failed':
                setCreateSprintLoading(false)
                setModalToast({ show: true, message: createSprintState.message ?? "Unknown Error", type: 'error' });
                break
        }
    } , [createSprintState])

    const handleSubmitSprint = async (data: SprintFormData) => {
        createSprint(data.name , data.description , data.startDate , data.endDate)
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <YourWorkSection />
            <main className="flex-1 flex flex-col p-6 overflow-y-auto relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Sprints</h1>
                    <button
                        onClick={() => {
                            setCreateModalOpen(true)
                        }}
                        className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Sprint
                    </button>
                </div>
                <div className="flex-1">
                    {buildProjectCard()}
                </div>
            </main>
            <TaskCreationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitTask}
                sprintID={sprintForNewTask?.id as string}
            />
            <SprintCreationModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setCreateModalOpen(false)
                }}
                toastState={modalToast}
                onToastClose={() => setModalToast({ ...modalToast, show: false })}
                isLoading={createSprintLoading}
                onSubmit={handleSubmitSprint}
            />
        </div>
    );
};

const SprintCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="animate-pulse flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="rounded-md bg-gray-200 h-10 w-10"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/4 pt-2"></div>
            </div>
        </div>
    )
}

interface SprintFormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface SprintFormErrors {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

const SprintCreationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SprintFormData) => Promise<void>;
    isLoading: boolean;
    // Props baru untuk mengontrol toast dari luar
    toastState: {
        show: boolean;
        message: string;
        type: 'success' | 'error' | null;
    };
    onToastClose: () => void;
}> = ({ isOpen, onClose, onSubmit, isLoading, toastState, onToastClose }) => {
    const [formData, setFormData] = useState<SprintFormData>({ name: '', description: '', startDate: '', endDate: '' });
    const [errors, setErrors] = useState<SprintFormErrors>({});

    // Gunakan useEffect untuk menutup toast dari luar
    useEffect(() => {
        if (toastState.show) {
            const timer = setTimeout(() => {
                onToastClose(); // Panggil fungsi dari props untuk menutup
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toastState.show, onToastClose]);

    useEffect(() => {
        if(!isOpen){
            setFormData({
                name : '',
                description : '',
                startDate : '',
                endDate : ''
            })
        }
    } , [isOpen])

    // ... (fungsi handleChange dan validateForm tetap sama) ...
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof SprintFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): SprintFormErrors => {
        const newErrors: SprintFormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nama sprint tidak boleh kosong.';
        if (!formData.description.trim()) newErrors.description = 'Deskripsi tidak boleh kosong.';
        if (!formData.startDate) { newErrors.startDate = 'Tanggal mulai harus diisi.'; } else { const startDate = new Date(formData.startDate); const today = new Date(); today.setHours(0, 0, 0, 0); if (startDate < today) newErrors.startDate = 'Tanggal mulai tidak boleh lebih awal dari hari ini.'; }
        if (!formData.endDate) newErrors.endDate = 'Tanggal selesai harus diisi.';
        if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) newErrors.endDate = 'Tanggal selesai tidak boleh mendahului tanggal mulai.';
        return newErrors;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        const startDateSplit = formData.startDate.split("-")
        const endDateSplit = formData.endDate.split("-")
        formData.startDate = `${startDateSplit[2]}-${startDateSplit[1]}-${startDateSplit[0]}`
        formData.endDate = `${endDateSplit[2]}-${endDateSplit[1]}-${endDateSplit[0]}`
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative overflow-hidden">
                <ModalToast
                    message={toastState.message}
                    type={toastState.type}
                    show={toastState.show}
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex justify-center items-center z-10 rounded-lg">
                        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center"><h2 className="text-xl font-semibold text-gray-800">Create Sprint</h2><button type="button" onClick={() => {
                        setFormData({
                            name : '',
                            description : '',
                            startDate : '',
                            endDate : ''
                        })
                        onClose()
                    }} disabled={isLoading} className="text-gray-400 hover:text-gray-600 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                    <div className="p-6 space-y-4">
                        <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Sprint</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., Q3 Marketing Campaign" />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                        <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Add a more detailed description..."></textarea>{errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`} />{errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}</div>
                            <div><label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`} />{errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}</div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 flex justify-end rounded-b-lg"><button type="button" onClick={() => {
                        setFormData({
                            name : '',
                            description : '',
                            startDate : '',
                            endDate : ''
                        })
                        onClose()
                    }} disabled={isLoading} className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 mr-2 hover:bg-gray-50 disabled:opacity-50">Cancel</button><button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-blue-400 disabled:cursor-not-allowed">Create Sprint</button></div>
                </form>
            </div>
        </div>
    );
};

export default SprintPage;