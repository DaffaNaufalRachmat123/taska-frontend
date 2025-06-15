// src/pages/TaskDetailPage.tsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTaskStore } from '../../stores/auth/task.store';
import { TaskDetailContent } from '../../components/TaskDetailContent';
import YourWorkSection from '../../components/YourWorkSection';

const TaskDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getTaskDetail, taskState, resetTaskDetailState } = useTaskStore(state => ({
        getTaskDetail: state.taskDetail,
        taskState: state.taskDetailState,
        resetTaskDetailState: state.resetTaskDetailState,
    }));

    useEffect(() => {
        if (id) {
            getTaskDetail(id);
        }

        return () => {
            resetTaskDetailState();
        };
    }, [id, getTaskDetail, resetTaskDetailState]);

    const renderContent = () => {
        if (taskState.type === 'Loading' || taskState.type === 'Idle') {
            return <div className="flex items-center justify-center h-full"><p className="animate-pulse">Loading task...</p></div>;
        }
        if (taskState.type === 'Failed' || !taskState.data?.data) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-red-600">Task Not Found</h3>
                    <p className="text-gray-500 mt-1">{taskState.errors || `Could not find a task with the ID "${id}".`}</p>
                    <button onClick={() => navigate('/sprint')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Go to Sprints</button>
                </div>
            );
        }
        // On success, render the shared content component
        return <TaskDetailContent task={taskState.data.data} />;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <main className="flex-1 flex flex-col overflow-hidden">
                {renderContent()}
            </main>
        </div>
    );
};

export default TaskDetailPage;