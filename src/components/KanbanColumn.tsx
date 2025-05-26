// src/components/board/KanbanColumn.tsx
import React from 'react';
import KanbanCard, { KanbanTask } from './KanbanCard';
import { PlusIcon } from '@heroicons/react/20/solid';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface KanbanColumnProps {
  column: { // Ubah prop menjadi objek kolom tunggal
    id: string;
    title: string;
    tasks: KanbanTask[];
  };
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { id: columnId, title, tasks } = column;

  // Membuat kolom itu sendiri sortable (untuk mengurutkan kolom) - opsional
  // const { attributes, listeners, setNodeRef: setSortableNodeRef, transform, transition, isDragging } = useSortable({
  //   id: columnId,
  //   data: { type: 'COLUMN', children: tasks }, // Kirim tasks jika perlu di handleDragEnd
  // });

  // Membuat kolom sebagai droppable area untuk kartu
  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: 'COLUMN', accepts: ['TASK'] } // Kolom menerima TASK
  });

  // const columnStyle = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  //   opacity: isDragging ? 0.5 : 1,
  // };

  return (
    // <div ref={setSortableNodeRef} style={columnStyle} {...attributes} {...listeners} // Jika kolom sortable
    <div ref={setDroppableNodeRef} // Hanya sebagai droppable area untuk kartu
      className={`bg-gray-100 rounded-lg p-3 w-72 md:w-80 flex-shrink-0 h-full flex flex-col
                  ${isOver ? 'ring-2 ring-blue-500' : ''}`} // Highlight saat kartu di atas kolom
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase">
          {title} <span className="text-gray-500 font-normal">{tasks.length}</span>
        </h3>
        {/* Tombol tambah task, jika perlu, bisa dibuat di sini */}
      </div>

      {/* Area untuk daftar kartu, harus bisa scroll jika banyak */}
      <div className="flex-grow overflow-y-auto pr-1 space-y-0.5 min-h-[100px]"> {/* min-h agar area drop tetap ada */}
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} {...task} />
          ))}
        </SortableContext>
      </div>
      {title.toLowerCase() !== "done" && (
        <button className="mt-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-200 p-2 rounded-md w-full text-left">
          <PlusIcon className="h-4 w-4 inline mr-1 align-middle" /> Create
        </button>
      )}
    </div>
    // </div> // Jika kolom sortable
  );
};

export default KanbanColumn;