// src/components/ProjectCard.tsx
import React, { useEffect } from 'react';
import { ChevronDownIcon, PlusIcon, PencilSquareIcon, TrashIcon , ArrowRightCircleIcon } from '@heroicons/react/24/outline'; // Ganti ke outline untuk konsistensi
import { useNavigate } from 'react-router-dom';
import { SprintData } from '../interfaces/sprint-interface';
import TaskItem from './TaskItem';
import { useTaskStore } from '../stores/auth/task.store';
import { TaskData } from '../interfaces/task-interface';
import { useAuthStore } from '../stores/auth/auth.store';

interface ProjectCardProps {
  sprint: SprintData;
  isDropdownOpen: boolean;
  isEditDeleteShow: boolean;
  onToggleDropdown: (sprintId: string) => void;
  onAddTask: (sprint: SprintData) => void;
  onEditSprint: (sprint: SprintData) => void | null;
  onDeleteSprint: (sprintId: SprintData) => void | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  sprint,
  isDropdownOpen,
  isEditDeleteShow,
  onToggleDropdown,
  onAddTask,
  onEditSprint,
  onDeleteSprint
}) => {
  const role = useAuthStore((state) => state.role)
  const taskList = useTaskStore(state => state.taskState);
  const getTask = useTaskStore(state => state.task);
  const resetState = useTaskStore((state) => state.resetState)
  const removeTaskFromList = useTaskStore(state => state.removeTaskItemFromList)
  const navigate = useNavigate();

  useEffect(() => {
    if (sprint.id && isDropdownOpen) {
      getTask(sprint.id);
    }
  }, [sprint.id, isDropdownOpen, getTask]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sprint.status.toLowerCase() === 'active') {
      navigate(`/board/${sprint.id}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah navigasi atau toggle dropdown
    onEditSprint(sprint);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event lain terpanggil
    onDeleteSprint(sprint); // Memanggil fungsi dari parent
  };

  const handleToggleTasks = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleDropdown(sprint.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isActive = sprint.status.toLowerCase() === 'active';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-5 transition-all duration-300 hover:shadow-xl">
      <div className="bg-gray-50 py-4 px-5 flex items-center justify-between">
        <div className="flex items-center space-x-3 truncate" onClick={handleCardClick}>
          <div className="bg-blue-500 rounded-md p-2 text-white flex-shrink-0">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
          </div>
          <div className="truncate">
            <h3 className="text-md font-semibold text-gray-800 truncate cursor-pointer hover:text-blue-600">
              {sprint.name || "Sprint Name"}
            </h3>
          </div>
        </div>
        {isEditDeleteShow && (
          <div className="flex items-center space-x-1">
            {/* Tombol Edit Sprint (yang sudah ada) */}
            {role === "admin" && (
              <button
                onClick={handleEditClick}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-colors"
                aria-label="Edit Sprint"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
            )}

            {role === "admin" && (
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-colors"
                aria-label="Delete Sprint"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="py-4 px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Start Date</p>
            <p className="font-medium">{formatDate(sprint.start_date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">End Date</p>
            <p className="font-medium">{formatDate(sprint.end_date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sprint.status)}`}>
              {sprint.status || "new"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Creator</p>
            <p className="font-medium truncate">{sprint.creator_name}</p>
          </div>
        </div>
      </div>

      <div
        className="border-t border-gray-200 py-3 px-5 text-sm text-gray-600 flex items-center justify-between hover:bg-gray-100 rounded-b-lg cursor-pointer"
        onClick={isActive ? handleCardClick : handleToggleTasks}
      >
        <span>{isActive ? <p style={{ fontWeight : 'bold' }}>View board</p> : 'View tasks'}</span>
        {isActive ? <ArrowRightCircleIcon className={'h5 w-5'} /> : <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />}
      </div>

      {isDropdownOpen && !isActive && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <h4 className="text-xs font-bold text-gray-600 mb-2 px-1">Tasks</h4>
          <ul className="space-y-2">
            {taskList.type === 'Loading' && <li className="text-sm text-gray-500 p-1">Loading tasks...</li>}
            {taskList.type === 'Success' && taskList.data?.data && taskList.data?.data.length > 0 ? (
              taskList.data.data.map(t => <TaskItem task={t} key={t.id} onDeleteFromList={(task : TaskData) => {
                removeTaskFromList(task.id)
                resetState()
              }} />)
            ) : (
              taskList.type !== 'Loading' && <li className="text-sm text-gray-500 p-2 bg-white rounded-md border text-center">No tasks in this sprint.</li>
            )}
          </ul>
          {taskList.type !== 'Loading' && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onAddTask(sprint);
              }}
              className="mt-3 p-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-md flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add task
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
