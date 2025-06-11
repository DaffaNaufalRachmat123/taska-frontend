// src/components/TaskDetailModal.tsx

import React, { useEffect, useState } from 'react';
import { 
  UserCircleIcon,
  LinkIcon, 
  CheckCircleIcon,
  TicketIcon,
  ExclamationTriangleIcon,
  BugAntIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useTaskStore } from '../stores/auth/task.store';
import LogItem from './LogItem';


interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, taskId }) => {
    const [copied, setCopied] = useState(false);
    const getTaskDetail = useTaskStore((state) => state.taskDetail);
    const taskState = useTaskStore((state) => state.taskDetailState);
    const resetTaskDetailState = useTaskStore((state) => state.resetTaskDetailState);

    useEffect(() => {
        if (isOpen && taskId) {
            getTaskDetail(taskId);
        }

        return () => {
            resetTaskDetailState();
        };
    }, [isOpen, taskId, getTaskDetail, resetTaskDetailState]);
    
    if (taskState.type === 'Loading') {
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <p className="text-gray-500">Loading...</p>
        </div>
        );
    }
    
    const renderModalContent = () => {
        if (taskState.type === 'Loading' || taskState.type === 'Idle') {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 animate-pulse">Loading task...</p>
                </div>
            );
        }

        if (taskState.type === 'Failed') {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-red-600">Failed to Load Task</h3>
                    <p className="text-gray-500 mt-1">{taskState.errors}</p>
                </div>
            );
        }

        if (taskState.type === 'Success' && taskState.data?.data) {
            const task = taskState.data.data;
            const priorityMap = {
                0: { label: 'High', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L7.03 7.83a.75.75 0 01-1.06-1.06l3.25-3.25a.75.75 0 011.06 0l3.25 3.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg> },
                1: { label: 'Medium', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500"><path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" /></svg> },
                2: { label: 'Low', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l2.22-2.22a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L6.47 12.28a.75.75 0 111.06-1.06l2.22 2.22V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg> },
            };
            const currentPriority = priorityMap[task.priority as keyof typeof priorityMap] || priorityMap[2];

            const typeMap = {
                'task': { icon: <TicketIcon className="w-4 h-4 text-blue-600" /> },
                'bug': { icon: <BugAntIcon className="w-4 h-4 text-red-600" /> },
            };

            const currentType = typeMap[task.type as keyof typeof typeMap] || typeMap['task'];

            const url = `${window.location.origin}/task/${taskId}`;
            const handleCopyLink = () => {
                navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                });
            };

            
            return (
            <>
                {/* === HEADER (Matches the reference style) === */}
                <header className="flex-shrink-0 flex items-center justify-between p-3 pl-4 pr-2 border-b border-gray-200">
                    <div className="flex items-center space-x-2 text-lg text-gray-500">
                        {currentType.icon}
                        <span>Task Detail</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button onClick={handleCopyLink} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
                            {copied ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <LinkIcon className="h-5 w-5" />}
                        </button>

                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                            title="Open in new tab"
                        >
                            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                        </a>

                        <button onClick={onClose} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </header>

                {/* === FORM-STYLE BODY (but for display) === */}
                <div className="flex-grow overflow-y-auto bg-gray-50/50">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                        
                        {/* --- Left Column --- */}
                        <div className="md:col-span-2 flex flex-col space-y-6">
                            {/* Task Name */}
                            <h1 className="w-full text-xl font-bold text-gray-800 p-2">
                                {task.name}
                            </h1>

                            {/* Description Section */}
                            <div className="flex-grow flex flex-col">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                                    Description
                                </label>
                                <div className="prose prose-sm text-gray-700 max-w-none p-2">
                                    <p>{task.description || 'No description provided.'}</p>
                                </div>
                            </div>
                             {/* Activity Section */}
                            <div className="mt-2">
                                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path d="M10 3.5a1.5 1.5 0 01.5 2.9a1.5 1.5 0 01-.5 2.9V12a.75.75 0 01-1.5 0V9.3a1.5 1.5 0 01-.5-2.9A1.5 1.5 0 0110 3.5z" transform="rotate(90 10 10)" /></svg>
                                    Logs Activity
                                </h3>
                                <div className="mt-4 space-y-5">
                                    {task.logs && task.logs.length > 0 ? (
                                        task.logs.map(log => <LogItem key={log.id} log={log} />)
                                    ) : (
                                        <p className="text-sm text-gray-500 pl-4">No activity yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column (Metadata) --- */}
                        <div className="md:col-span-1 space-y-6">
                            {/* Status */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-400" />
                                    Status
                                </label>
                                <div className="flex items-center space-x-2 p-1.5 pl-2 bg-gray-100 rounded-md border border-gray-200">
                                    <span className="font-medium text-gray-800">{task.status}</span>
                                </div>
                            </div>
                            {/* Assignee */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <UserCircleIcon className="w-4 h-4 mr-2 text-gray-400" />
                                    Assignee
                                </label>
                                <div className="flex items-center space-x-2 p-1.5 pl-2 bg-gray-100 rounded-md border border-gray-200">
                                    {task.assignee_name ? (() => {
                                        const colors = ['bg-red-200 text-red-800', 'bg-green-200 text-green-800', 'bg-blue-200 text-blue-800', 'bg-yellow-200 text-yellow-800', 'bg-purple-200 text-purple-800'];
                                        const color = colors[task.assignee_name.charCodeAt(0) % colors.length];
                                        return <>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>{task.assignee_name.charAt(0).toUpperCase()}</div>
                                            <span className="font-medium text-gray-800">{task.assignee_name}</span>
                                        </>;
                                    })() : (
                                        <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg><span className="text-gray-500">Unassigned</span></>
                                    )}
                                </div>
                            </div>
                             {/* Reporter */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <UserCircleIcon className="w-4 h-4 mr-2 text-gray-400" />
                                    Reporter
                                </label>
                                <div className="flex items-center space-x-2 p-1.5 pl-2 bg-gray-100 rounded-md border border-gray-200">
                                {(() => {
                                        const colors = ['bg-pink-200 text-pink-800', 'bg-cyan-200 text-cyan-800', 'bg-orange-200 text-orange-800'];
                                        const color = colors[task.reporter_name.charCodeAt(0) % colors.length];
                                        return <>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>{task.reporter_name.charAt(0).toUpperCase()}</div>
                                            <span className="font-medium text-gray-800">{task.reporter_name}</span>
                                        </>;
                                    })()}
                                </div>
                            </div>
                            {/* Priority */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-gray-400"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                                    Priority
                                </label>
                                <div className="flex items-center space-x-2 p-1.5 pl-2 bg-gray-100 rounded-md border border-gray-200">
                                    <>{currentPriority.icon} <span className="font-medium text-gray-800">{currentPriority.label}</span></>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            );
        }
        return null; // Should not be reached if states are handled, but good for safety
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {renderModalContent()}
            </div>
        </div>
    );
};

export default TaskDetailModal;