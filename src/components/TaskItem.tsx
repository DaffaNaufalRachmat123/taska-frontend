// src/components/TaskItem.tsx
import React from 'react';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { Task } from './types/Task'; // Asumsi Anda membuat src/types/index.ts

interface TaskItemProps extends Task {} // Menggunakan tipe Task dari file terpisah

const TaskItem: React.FC<TaskItemProps> = ({ id, name, sprint, status, type }) => {
  const isCompleted = status === 'completed';
  // Menggunakan PlusCircleIcon untuk tipe 'new' agar lebih jelas seperti di gambar
  const IconComponent = isCompleted ? CheckCircleIcon : PlusCircleIcon;
  const iconColor = isCompleted ? 'text-blue-500' : 'text-purple-500';

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center">
        <IconComponent className={`h-5 w-5 ${iconColor} mr-3 flex-shrink-0`} />
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">
            {id} - {sprint}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">Type</span>
        {/** Menampilkan text tipe task - Bug atau Task dan sesuaikan warna **/}
        <span className={`text-xs font-semibold ${type === 'bug' ? 'text-red-500' : 'text-green-500'}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;