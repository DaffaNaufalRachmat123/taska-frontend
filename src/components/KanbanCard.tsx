// src/components/KanbanCard.tsx

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskData } from '../interfaces/task-interface';

// --- Import new icons ---
import {
  CheckCircleIcon,
  BugAntIcon,
  ClipboardDocumentCheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from '@heroicons/react/20/solid';

// --- Helper object to map priority levels to icons and styles ---
const priorityMap = {
  0: { icon: ArrowUpIcon, color: 'text-red-500', label: 'High' },
  1: { icon: MinusIcon, color: 'text-yellow-500', label: 'Medium' },
  2: { icon: ArrowDownIcon, color: 'text-green-500', label: 'Low' },
};

const KanbanCard: React.FC<{ task: TaskData }> = ({ task }) => {
  // Destructure all needed properties from the task object
  const { id, name, status, type, priority, assignee_name } = task;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'task',
      task: task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'none',
  };
  
  // Get the correct icon component and color from the priority map
  const PriorityIcon = priorityMap[priority as keyof typeof priorityMap].icon;
  const priorityColor = priorityMap[priority as keyof typeof priorityMap].color;
  const priorityLabel = priorityMap[priority as keyof typeof priorityMap].label;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-md shadow border border-gray-200 mb-3 touch-none"
    >
      <p 
        className="text-sm font-medium text-gray-800 mb-2"
      >
        {name}
      </p>

      {/* --- Bottom section with metadata --- */}
      <div className="flex items-center justify-between">
        {/* Left side: ID and Status */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {type === 'bug' ? (
            <BugAntIcon className="h-4 w-4 text-red-600" title="Bug" />
          ) : (
            <ClipboardDocumentCheckIcon className="h-4 w-4 text-gray-400" title="Task" />
          )}
          <PriorityIcon className={`h-4 w-4 ${priorityColor}`} title={`Priority: ${priorityLabel}`} />
          <span>{id.substring(0, 6)}...</span>
        </div>

        {/* Right side: Status and Assignee */}
        <div className="flex items-center space-x-2">
          {status === 'completed' && <CheckCircleIcon className="h-4 w-4 text-blue-500" title="Completed"/>}

          {/* Assignee Avatar */}
          <div 
            title={assignee_name ? `Assignee: ${assignee_name}` : 'Unassigned'}
            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${assignee_name ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400 border'}`}
          >
            {assignee_name?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;