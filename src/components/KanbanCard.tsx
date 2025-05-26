// src/components/board/KanbanCard.tsx
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface KanbanTask {
  id: string;
  title: string;
  tags?: string[];
  assignee?: string;
  isCompleted?: boolean;
  columnId: string | undefined;
}

const KanbanCard: React.FC<KanbanTask> = ({ id, title, tags, assignee, isCompleted , columnId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Ini menandakan item asli sedang di-drag
  } = useSortable({ id: id, data: { type: 'TASK', title: title, taskData: { id, title, tags, assignee, isCompleted, columnId } } }); // Kirim taskData

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Saat DragOverlay aktif, item asli bisa dibuat lebih transparan atau disembunyikan
    opacity: isDragging ? 0.4 : 1, // Buat item asli sedikit transparan
    // Atau visibility: isDragging ? 'hidden' : 'visible',
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
      {/* Konten kartu tetap sama */}
      <p className="text-sm font-medium text-gray-800 mb-1">{title}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          {isCompleted && <CheckCircleIcon className="h-4 w-4 text-blue-500" />}
          <span>{id.substring(0, 6)}...</span>
        </div>
        {assignee ? (
          <div className="h-5 w-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {assignee.charAt(0).toUpperCase()}
          </div>
        ) : (
          <UserCircleIcon className="h-5 w-5 text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default KanbanCard;