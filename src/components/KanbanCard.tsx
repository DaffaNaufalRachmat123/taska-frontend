import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskData } from '../interfaces/task-interface';

const KanbanCard: React.FC<{task : TaskData}> = ({ task }) => {
  const { id, name, status } = task;
  
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
      task: task
    } 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-md shadow border border-gray-200 mb-3 touch-none"
    >
      <p className="text-sm font-medium text-gray-800 mb-1">{name}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          {status === 'completed' && <CheckCircleIcon className="h-4 w-4 text-blue-500" />}
          <span>{id.substring(0, 6)}...</span>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;