// src/components/board/BoardContent.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon, ChevronDownIcon, StarIcon as StarIconOutline, EllipsisHorizontalIcon,
  AdjustmentsHorizontalIcon, EyeIcon, ChartBarIcon,
  CheckIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import KanbanColumn from './KanbanColumn';
import KanbanCard, { KanbanTask } from './KanbanCard'; // Pastikan KanbanTask diekspor dari KanbanCard
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// Definisikan tipe untuk sebuah kolom
export interface Column {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

// Contoh data awal untuk kolom
const initialColumnsData: Column[] = [
  {
    id: 'col-todo',
    title: 'TO DO',
    tasks: [
      { id: 'task-1', title: '(Sample) Develop Frontend Interface', tags: ['sample chatbot development'], assignee: 'D', isCompleted: true, columnId: 'col-todo' },
      { id: 'task-2', title: 'Another TO DO item', tags: ['UI design'], assignee: 'A', columnId: 'col-todo' },
      { id: 'task-3', title: 'Third TO DO task', tags: [], assignee: 'B', columnId: 'col-todo' },
    ],
  },
  {
    id: 'col-inprogress',
    title: 'IN PROGRESS',
    tasks: [
      { id: 'task-4', title: '(Sample) Implement NLP Engine', tags: ['sample chatbot development'], assignee: 'D', isCompleted: true, columnId: 'col-inprogress' },
      { id: 'task-5', title: '(Sample) Design Chatbot Personality', tags: ['sample user interaction design'], assignee: 'M', columnId: 'col-inprogress' },
    ],
  },
  {
    id: 'col-done',
    title: 'DONE',
    tasks: [
      { id: 'task-6', title: 'Review completed work', tags: [], assignee: 'S', isCompleted: true, columnId: 'col-done' },
    ],
  },
];

interface BoardContentProps {
  projectTitle?: string;
}

const BoardContent: React.FC<BoardContentProps> = ({ projectTitle = "CCS board" }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumnsData);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  // State untuk form tambah kolom inline
  const [isAddingColumn, setIsAddingColumn] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const addColumnInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Pengguna harus menggeser 10px sebelum drag dimulai
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fungsi helper untuk menemukan kolom berdasarkan ID (bisa ID kolom atau ID task di dalamnya)
  const findColumnContainingTask = (taskId: UniqueIdentifier, currentColumns: Column[]): Column | undefined => {
    return currentColumns.find(col => col.tasks.some(task => task.id === taskId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'TASK' && active.data.current?.taskData) {
      setActiveTask(active.data.current.taskData as KanbanTask);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeTask) return;
    if (active.id === over.id) return;

    if (active.data.current?.type !== 'TASK') return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const originalColumnId = activeTask.columnId;
    let targetColumnId: string | undefined;

    if (over.data.current?.type === 'COLUMN') {
      targetColumnId = overId;
    } else if (over.data.current?.type === 'TASK') {
      targetColumnId = (over.data.current.taskData as KanbanTask)?.columnId;
    }

    if (!targetColumnId || originalColumnId === targetColumnId) {
      // Jika masih di kolom yang sama atau tidak ada target jelas, serahkan ke handleDragEnd untuk sorting intra-kolom
      return;
    }

    // Pindahkan task secara visual ke kolom 'over' untuk feedback UX
    setColumns(prev => {
      const activeColumn = prev.find(col => col.id === originalColumnId);
      const overColumn = prev.find(col => col.id === targetColumnId);

      if (!activeColumn || !overColumn) return prev;

      const activeTaskIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
      if (activeTaskIndex === -1) return prev;

      const newColumns = prev.map(col => ({ ...col, tasks: [...col.tasks] })); // Deep copy
      const [movedTask] = newColumns.find(c => c.id === originalColumnId)!.tasks.splice(activeTaskIndex, 1);
      
      if (movedTask) {
        movedTask.columnId = targetColumnId; // Update columnId task
        const targetColForVisual = newColumns.find(c => c.id === targetColumnId)!;
        
        // Tentukan posisi penyisipan di kolom target secara visual
        const overTaskIndexInTarget = targetColForVisual.tasks.findIndex(task => task.id === overId);
        if (over.data.current?.type === 'TASK' && overTaskIndexInTarget !== -1) {
            targetColForVisual.tasks.splice(overTaskIndexInTarget, 0, movedTask);
        } else { // Jika dijatuhkan di kolom atau tidak ada target task spesifik
            targetColForVisual.tasks.push(movedTask);
        }
      }
      return newColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type !== 'TASK') return;

    const activeTaskData = active.data.current.taskData as KanbanTask;
    const originalColumnId = activeTaskData.columnId;

    let targetColumnId: string | undefined;
    let targetIsColumnItself = false; // Apakah target drop adalah kolom itu sendiri?
    let targetOverIsTask = false; // Apakah target drop adalah task lain?

    if (over.data.current?.type === 'COLUMN') {
      targetColumnId = overId;
      targetIsColumnItself = true;
    } else if (over.data.current?.type === 'TASK') {
      targetColumnId = (over.data.current.taskData as KanbanTask)?.columnId;
      targetOverIsTask = true;
    }

    // Jika tidak ada target kolom yang valid setelah drag selesai
    if (!targetColumnId) {
      // Kembalikan task ke kolom asalnya jika tidak ada perubahan berarti
      // (misalnya, jika handleDragOver sudah memindahkannya secara visual tapi drag dibatalkan/tidak valid)
      // Ini adalah fallback, idealnya state sudah konsisten dari handleDragOver jika valid
      setColumns(prev => {
        const taskStillExists = prev.some(col => col.tasks.some(t => t.id === activeId));
        if(!taskStillExists){ // Jika task hilang karena logika handleDragOver dan dragEnd tidak valid
            const originalCol = prev.find(c => c.id === originalColumnId);
            if(originalCol){
                const newColumns = prev.map(c => c.id === originalColumnId ? {...c, tasks: [...c.tasks, activeTaskData]} : c);
                return newColumns;
            }
        }
        return prev;
      });
      return;
    }

    setColumns(prev => {
      const newColumns = prev.map(col => ({ ...col, tasks: [...col.tasks] })); // Deep copy

      // 1. Temukan dan hapus task dari kolom asalnya (jika belum dipindahkan oleh onDragOver)
      //    Atau, jika onDragOver sudah memindahkan, pastikan kita bekerja dengan state yang benar
      const sourceColumn = findColumnContainingTask(activeId, newColumns) || newColumns.find(col => col.id === originalColumnId);
      let taskToMove: KanbanTask | undefined;
      let sourceTaskIndex = -1;

      if (sourceColumn) {
        sourceTaskIndex = sourceColumn.tasks.findIndex(t => t.id === activeId);
        if (sourceTaskIndex > -1) {
          // Jika task masih di sourceColumn (belum dipindahkan oleh onDragOver ke kolom lain)
          taskToMove = { ...sourceColumn.tasks[sourceTaskIndex] };
          sourceColumn.tasks.splice(sourceTaskIndex, 1);
        }
      }
      
      // Jika taskToMove belum ada (mungkin sudah dipindahkan oleh onDragOver), ambil dari activeTaskData
      if (!taskToMove) {
        taskToMove = { ...activeTaskData }; 
      }
      
      if (!taskToMove) return prev; // Seharusnya tidak terjadi jika activeTaskData ada

      taskToMove.columnId = targetColumnId; // Finalisasi columnId

      // 2. Tambahkan task ke kolom tujuan
      const targetColumn = newColumns.find(col => col.id === targetColumnId);
      if (!targetColumn) return prev; // Kolom tujuan tidak ditemukan

      if (targetIsColumnItself) {
        // Dijatuhkan di area kosong kolom, tambahkan ke akhir
        targetColumn.tasks.push(taskToMove);
      } else if (targetOverIsTask) {
        // Dijatuhkan di atas task lain (overId adalah ID task)
        const overTaskIndex = targetColumn.tasks.findIndex(t => t.id === overId);
        if (overTaskIndex !== -1) {
          targetColumn.tasks.splice(overTaskIndex, 0, taskToMove);
        } else {
          // Fallback: Task target tidak ditemukan di kolom target, tambahkan ke akhir
          targetColumn.tasks.push(taskToMove);
        }
      } else {
         // Seharusnya tidak sampai sini jika targetColumnId valid.
         // Ini bisa jadi jika over.id bukan task dan bukan kolom yang dikenal.
         // Sebagai fallback, tambahkan ke akhir kolom target yang teridentifikasi.
         targetColumn.tasks.push(taskToMove);
      }
      
      return newColumns;
    });
  };

  // Efek untuk fokus ke input saat form muncul
  useEffect(() => {
    if (isAddingColumn && addColumnInputRef.current) {
      addColumnInputRef.current.focus();
    }
  }, [isAddingColumn]);

  const showAddColumnForm = () => {
    setIsAddingColumn(true);
    setNewColumnName("");
  };

  const handleConfirmAddColumn = () => {
    if (newColumnName && newColumnName.trim() !== "") {
      const newColumn: Column = {
        id: `col-${Date.now()}`,
        title: newColumnName.trim(),
        tasks: [],
      };
      setColumns(prevColumns => [...prevColumns, newColumn]);
      setIsAddingColumn(false);
      setNewColumnName("");
    } else if (addColumnInputRef.current) {
        addColumnInputRef.current.focus();
    }
  };

  const handleCancelAddColumn = () => {
    setIsAddingColumn(false);
    setNewColumnName("");
  };

  const handleNewColumnNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleConfirmAddColumn();
    } else if (event.key === 'Escape') {
      handleCancelAddColumn();
    }
  };

  return (
    <main className="flex-1 flex flex-col p-6 bg-white overflow-hidden">
      {/* Header Papan */}
      <div className="flex justify-between items-center mb-4">
        <div><p className="text-xs text-gray-500">Projects / Chatbot for Customer Support</p><h1 className="text-2xl font-semibold text-gray-800">{projectTitle}</h1></div>
        <div className="flex items-center space-x-3">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"><StarIconOutline className="h-5 w-5" /></button>
          <button className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-300">Start stand-up</button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"><EllipsisHorizontalIcon className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Toolbar Papan */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative"><MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search" className="pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" /></div>
          <div className="flex -space-x-2"><div className="h-8 w-8 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">D</div><div className="h-8 w-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</div></div>
          <button className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-300 flex items-center">Epic <ChevronDownIcon className="h-4 w-4 ml-1" /></button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md flex items-center"><AdjustmentsHorizontalIcon className="h-5 w-5 mr-1.5 text-gray-500" /> Group by: None <ChevronDownIcon className="h-4 w-4 ml-1" /></button>
          <button className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md flex items-center"><ChartBarIcon className="h-5 w-5 mr-1.5 text-gray-500" /> Insights</button>
          <button className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md flex items-center"><EyeIcon className="h-5 w-5 mr-1.5 text-gray-500" /> View settings</button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners} // Anda bisa bereksperimen dengan strategi collision detection
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 h-full items-start">
          {columns.map(column => (
            <KanbanColumn key={column.id} column={column} />
          ))}
          {isAddingColumn ? (
            <div className="bg-white p-3 rounded-lg shadow-md w-72 md:w-80 flex-shrink-0 flex flex-col space-y-2 self-start border border-gray-200">
              <input ref={addColumnInputRef} type="text" placeholder="Enter column name..." value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} onKeyDown={handleNewColumnNameKeyDown} className="px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"/>
              <div className="flex space-x-2 justify-end">
                <button onClick={handleConfirmAddColumn} className="p-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500" aria-label="Confirm add column"><CheckIcon className="h-5 w-5 text-green-600" /></button>
                <button onClick={handleCancelAddColumn} className="p-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500" aria-label="Cancel add column"><XMarkIcon className="h-5 w-5 text-red-600" /></button>
              </div>
            </div>
          ) : (
            <button onClick={showAddColumnForm} className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg p-3 w-72 md:w-80 flex-shrink-0 h-12 flex items-center justify-center text-sm self-start">
              <PlusIcon className="h-5 w-5 mr-1" /> Add column
            </button>
          )}
        </div>

        <DragOverlay dropAnimation={null} style={{ pointerEvents: 'none' }}> {/* pointerEvents none agar tidak mengganggu deteksi 'over' */}
          {activeTask ? (
            <KanbanCard
              // Render versi "ghost" dari kartu
              id={activeTask.id}
              title={activeTask.title}
              tags={activeTask.tags}
              assignee={activeTask.assignee}
              isCompleted={activeTask.isCompleted}
              columnId={activeTask.columnId} // Ini adalah columnId saat drag dimulai
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Quickstart button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center text-sm"><StarIconOutline className="h-5 w-5 mr-2" /> Quickstart</button>
    </main>
  );
};

export default BoardContent;