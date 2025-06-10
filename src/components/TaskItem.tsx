// src/components/TaskItem.tsx
import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { TaskData, TaskFormData } from '../interfaces/task-interface';
import { ArrowPathIcon, BugAntIcon, EllipsisVerticalIcon, TicketIcon, UserCircleIcon, DocumentMagnifyingGlassIcon, BeakerIcon } from '@heroicons/react/24/outline';
import TaskCreationModal from './TaskCreationModal';
import { SprintData } from '../interfaces/sprint-interface';
import { useTaskStore } from '../stores/auth/task.store';

interface TaskItemProps {
  task: TaskData;
}


const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    // Destructure all needed properties from the task object
    const { id, name, status, type, assignee_name, reporter_name } = task;

    // Helper to determine the main status icon and color
    const getStatusInfo = () => {
      switch (status.toLowerCase()) {
        case 'completed':
          return { Icon: CheckCircleIcon, color: 'text-green-500' };
        case 'in_progress':
          return { Icon: ArrowPathIcon, color: 'text-purple-500' };
        case 'in_review':
          return { Icon: DocumentMagnifyingGlassIcon, color: 'text-yellow-500' };
        case 'in_testing':
          return { Icon: BeakerIcon, color: 'text-blue-500' };
        default: 
          return { Icon: type.toLowerCase() === 'bug' ? BugAntIcon : TicketIcon, color: type.toLowerCase() === 'bug' ? 'text-red-500' : 'text-blue-500' };
      }
    };

    const { Icon: StatusIcon, color: statusColor } = getStatusInfo();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const updateTask = useTaskStore((state) => state.updateTask);
    const getTask = useTaskStore((state) => state.task);

    const handleOpenAddTaskModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitTask = async (payload: TaskFormData) => {
        await updateTask(task.id, payload)

        if (task.sprint_id) {
          getTask(task.sprint_id);
        }

        handleCloseModal();
    };

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleOpenAddTaskModal()
    };

    
    return (
      // Add 'group' to enable group-hover for the action button
      <div className="group flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors">
        {/* Left Side: Icon, Name, Reporter, ID */}
        <div className="flex items-center">
          <StatusIcon className={`h-5 w-5 ${statusColor} mr-3 flex-shrink-0`} />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-800">{name}</p>
            <p className="text-xs text-gray-500">
              {reporter_name ? `${reporter_name} • ` : ''}{id}
            </p>
          </div>
        </div>

        {/* Right Side: Assignee Avatar and Action Button */}
        <div className="flex items-center space-x-3">
          {/* Assignee Avatar with Initial */}
          {assignee_name ? (
            (() => {
              // Simple color hashing for consistent avatar colors
              const colors = ['bg-red-100 text-red-700', 'bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-purple-100 text-purple-700'];
              const color = colors[assignee_name.charCodeAt(0) % colors.length];
              return (
                <div title={assignee_name} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>
                  {assignee_name.charAt(0).toUpperCase()}
                </div>
              );
            })()
          ) : (
            <UserCircleIcon className="h-6 w-6 text-gray-300" title="Unassigned" />
          )}
          
          {/* Action Button - appears on hover */}
          <button
            onClick={handleEditClick}
            className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-600 focus:opacity-100 transition-opacity"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>

        { /** Modal Edit Task */}
        < TaskCreationModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTask}
          sprintID={task.sprint_id as string}
          taskToEdit={task}
        />
      </div>
  );
};

export default TaskItem;