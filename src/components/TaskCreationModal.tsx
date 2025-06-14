// src/components/TaskModal.tsx

import React, { useState, useEffect } from 'react';
import { TaskData, TaskFormData } from '../interfaces/task-interface';
import { useUserStore } from '../stores/auth/user.store';
import { useSprintStore } from '../stores/auth/sprint.store';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: TaskFormData) => void;
    taskToEdit?: TaskData | null;
    sprintID: String | null;
    disableSelectSprint?: boolean; // Optional prop to disable sprint selection
}

const initialFormData: TaskFormData = {
    name: '',
    description: '',
    sprint_id: '',
    type: 'task',
    priority: 2,
    story_point: 0,
    assignee_id: '',
};

const TaskCreationModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, taskToEdit, sprintID, disableSelectSprint }) => {
    const [formData, setFormData] = useState<TaskFormData>(initialFormData);
    const isEditMode = !!taskToEdit;
    const users = useUserStore(state => state.userState);
    const getUsers = useUserStore(state => state.user);
    const getSprintConfig = useSprintStore(state => state.sprintConfig);
    const sprintConfigs = useSprintStore(state => state.sprintConfigState);

    useEffect(() => {
        if (users.type === 'Idle') {
            getUsers();
        }
    }, [users.type, getUsers]);

    useEffect(() => {
        if (sprintConfigs.type === 'Idle') {
            getSprintConfig();
        }
    }, [sprintConfigs.type, getSprintConfig]);

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setFormData({
                    ...taskToEdit,
                    assignee_id: taskToEdit.assignee_id || '',
                    sprint_id: sprintID as string
                });
            } else {
                setFormData({
                    ...initialFormData,
                    sprint_id: sprintID as string || '',
                });
            }
        }
    }, [isOpen, taskToEdit, sprintID]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const processedValue = (name === 'priority' || name === 'story_point') ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    if (!isOpen) return null;


    return (
        // Backdrop with a subtle blur effect for a modern feel
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()} 
        >
            {/* === HEADER === */}
            <header className="flex items-center justify-between p-4 pl-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
                {/* Icon can change based on task type */}
                <div className="bg-gray-100 rounded p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                {isEditMode ? 'Update Task' : 'Create Task'}
                </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </header>

            {/* === FORM === */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto bg-gray-50/50">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                
                <div className="md:col-span-2 flex flex-col space-y-6">
                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Task name or title"
                            className="w-full text-xl font-bold text-gray-800 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:border-b-2 focus:border-indigo-500 transition-colors duration-200 p-2"
                            required
                        />
                    </div>

                    {/* Description Section */}
                    <div className="flex-grow flex flex-col">
                        <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={10}
                            placeholder="Add a more detailed description... (Markdown is supported)"
                            className="flex-grow w-full text-gray-700 bg-transparent border-none focus:ring-2 focus:ring-indigo-200 rounded-md p-2 transition-shadow"
                        />
                    </div>
                </div>

                {/* --- Right Column (Metadata) --- */}
                <div className="md:col-span-1 space-y-6">
                    {/* Assignee */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.99 9.99 0 0010 12c-2.31 0-4.438.784-6.131 2.095z" /></svg>
                            Assignee
                        </label>
                        <div className="relative">
                            {/* The actual, invisible select box */}
                            <select id="assignee_id" name="assignee_id" value={formData?.assignee_id || ''} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                                <option value="">Unassigned</option>
                                {users.type === "Success" && (users.data?.data || []).map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                            
                            <div className="flex items-center space-x-2 p-1.5 pl-2 bg-gray-100 rounded-md border border-gray-200 hover:border-gray-400 transition-colors">
                                {(() => {
                                    if (!formData.assignee_id || formData.assignee_id === '') {
                                        return <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg><span className="text-gray-500">Unassigned</span></>;
                                    }
                                    const user = users.data?.data.find(u => u.id === formData.assignee_id);
                                    if (!user) return null;
                                    const colors = ['bg-red-200 text-red-800', 'bg-green-200 text-green-800', 'bg-blue-200 text-blue-800', 'bg-yellow-200 text-yellow-800', 'bg-purple-200 text-purple-800'];
                                    const color = colors[user.name.charCodeAt(0) % colors.length];
                                    return <>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>{user.name.charAt(0).toUpperCase()}</div>
                                        <span className="font-medium text-gray-800">{user.name}</span>
                                    </>;
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Sprint */}
                    <div>
                        <label htmlFor="sprint_id" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path fillRule="evenodd" d="M6.22 8.22a.75.75 0 011.06 0l3.22 3.22 3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0L6.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                            Sprint
                        </label>
                        <div className="relative">
                            <select 
                                id="sprint_id" 
                                name="sprint_id" 
                                value={formData.sprint_id} 
                                onChange={handleChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                disabled={disableSelectSprint}
                            >
                                <option value="">No Sprint</option>
                                { sprintConfigs.type === 'Success' && sprintConfigs.data?.data.map(s => <option key={s.id} value={s.id}>{s.name}</option>) }
                            </select>
                            
                            <div className="flex items-center space-x-2 p-1.5 pl-2 bg-gray-100 rounded-md border border-gray-200 hover:border-gray-400 transition-colors">
                                {(() => {
                                    const selectedSprint = sprintConfigs.data?.data.find(s => s.id === formData.sprint_id);
                                    if (!selectedSprint) {
                                        return <span className="text-gray-500">Select a sprint...</span>;
                                    }
                                    return <span className="font-medium text-gray-800">{selectedSprint.name}</span>;
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                            Priority
                        </label>
                        <div className="relative">
                            <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                                <option value={0}>High</option>
                                <option value={1}>Medium</option>
                                <option value={2}>Low</option>
                            </select>

                            <div className="flex items-center space-x-2 p-1.5 pl-2 bg-gray-100 rounded-md border border-gray-200 hover:border-gray-400 transition-colors">
                                {(() => {
                                    const priorityMap = {
                                        0: { label: 'High', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L7.03 7.83a.75.75 0 01-1.06-1.06l3.25-3.25a.75.75 0 011.06 0l3.25 3.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg> },
                                        1: { label: 'Medium', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500"><path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" /></svg> },
                                        2: { label: 'Low', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l2.22-2.22a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L6.47 12.28a.75.75 0 111.06-1.06l2.22 2.22V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg> },
                                    };
                                    const selected = priorityMap[formData.priority as keyof typeof priorityMap] || priorityMap[2];
                                    return <>{selected.icon} <span className="font-medium text-gray-800">{selected.label}</span></>;
                                })()}
                            </div>
                        </div>
                    </div>
                
                    {/* Story Points */}
                    <div>
                        <label htmlFor="story_point" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                            Story Points
                        </label>
                        <div className="bg-gray-100 rounded-md border border-gray-200 hover:border-gray-400 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                            <input 
                                type="number"
                                id="story_point"
                                name="story_point"
                                value={formData.story_point}
                                onChange={handleChange}
                                min="0"
                                max="5"
                                placeholder="0"
                                className="w-full bg-transparent p-1.5 pl-2 border-none focus:ring-0 text-gray-800 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* === FOOTER === */}
            <footer className="flex items-center justify-end p-4 border-t border-gray-200 bg-white sticky bottom-0">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
                </button>
                <button type="submit" className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {isEditMode ? 'Save Changes' : 'Create Task'}
                </button>
            </footer>
            </form>
        </div>
        </div>
    );
};

export default TaskCreationModal;