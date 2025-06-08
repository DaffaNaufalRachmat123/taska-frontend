import React from 'react';
import KanbanCard from './KanbanCard';
import { PlusIcon } from '@heroicons/react/20/solid';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { TaskData } from '../interfaces/task-interface';

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    tasks?: TaskData[];
    status: string;
  };
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { id: columnId, status, tasks, title } = column;

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { 
      type: 'column',
      status: status
    }
  });

  return (
    <div 
      ref={setDroppableNodeRef}
      data-column-id={columnId}
      className={`bg-gray-100 rounded-lg p-3 w-72 md:w-80 flex-shrink-0 h-full flex flex-col
                  ${isOver ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase">
          {title} <span className="text-gray-500 font-normal">{tasks?.length}</span>
        </h3>
      </div>

      <div className="flex-grow overflow-y-auto pr-1 space-y-0.5 min-h-[100px]">
        <SortableContext items={(tasks || []).map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks?.map(task => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      
      {status.toLowerCase() === 'todo' && (
        <button className="mt-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-200 p-2 rounded-md w-full text-left">
          <PlusIcon className="h-4 w-4 inline mr-1 align-middle" /> Create
        </button>
      )}
    </div>
  );
};

export default KanbanColumn;