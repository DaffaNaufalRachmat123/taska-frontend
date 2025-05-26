// src/components/TaskItem.tsx
import React from 'react';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { Task } from './types/Task'; // Asumsi Anda membuat src/types/index.ts

interface TaskItemProps extends Task {} // Menggunakan tipe Task dari file terpisah

const TaskItem: React.FC<TaskItemProps> = ({ id, title, project, type }) => {
  const isCompleted = type === 'completed';
  // Menggunakan PlusCircleIcon untuk tipe 'new' agar lebih jelas seperti di gambar
  const IconComponent = isCompleted ? CheckCircleIcon : PlusCircleIcon;
  const iconColor = isCompleted ? 'text-blue-500' : 'text-purple-500';

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center">
        <IconComponent className={`h-5 w-5 ${iconColor} mr-3 flex-shrink-0`} />
        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">
            {id} - {project}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">Created</span>
        {/* Avatar Pembuat Tugas */}
        <div className="h-6 w-6 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          D
        </div>
      </div>
    </div>
  );
};

export default TaskItem;