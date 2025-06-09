// src/components/board/BoardContent.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import KanbanColumn from './KanbanColumn';
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
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { TaskData } from '../interfaces/task-interface';
import KanbanCard from './KanbanCard';
import { useTaskStore } from '../stores/auth/task.store';
import { useParams } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import UserFilter from './UserFilter';

// Definisikan tipe untuk sebuah kolom
export interface Column {
  id: string;
  title: string;
  tasks?: TaskData[];
  status: string;
}

// Initial data for columns (now correctly used)
const initialColumnsData: Column[] = [
  { id: 'col-todo', title: 'TO DO', status: 'todo' },
  { id: 'col-inprogress', title: 'IN PROGRESS', status: 'in_progress' },
  { id: 'col-inreview', title: 'IN REVIEW', status: 'in_review' },
  { id: 'col-inting', title: 'IN TESTING', status: 'in_testing' },
  { id: 'col-completed', title: 'COMPLETED', status: 'completed' },
];

interface BoardContentProps {
  projectTitle?: string;
}

const BoardContent: React.FC<BoardContentProps> = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const [columns] = useState<Column[]>(initialColumnsData);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [activeTask, setActiveTask] = useState<TaskData | null>(null);

  const getTasks = useTaskStore((state) => state.task);
  const tasksState = useTaskStore((state) => state.taskState);
  const updateTaskInStore = useTaskStore((state) => state.updateTask);

  // This ref stores the tasks array that was active *before* a drag started
  // It's used for reverting UI if a drag operation is invalid or cancelled
  const tasksBeforeDragRef = useRef<TaskData[]>([]);

  useEffect(() => {
    if (sprintId) {
      getTasks(sprintId);
    }
  }, [sprintId, getTasks]);

  useEffect(() => {
    // This effect updates local 'tasks' state whenever the store's 'tasksState' changes.
    // This is the primary way the UI stays in sync with the persistent data.
    if (tasksState.type === 'Success' && tasksState.data) {
      setTasks(tasksState.data.data || []);
      // Also update the ref when tasks are successfully loaded/updated
      tasksBeforeDragRef.current = tasksState.data.data || [];
    } else if (tasksState.type === 'Failed') {
      console.error("Error loading tasks:", tasksState.errors);
      // TODO: Display an error message to the user here
    }
  }, [tasksState]); // Dependency array should be [tasksState] to react to store changes

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

    // Improved findColumn function
  const findColumn = useCallback((id: string) => {
    return initialColumnsData.find(col => 
      col.id === id || id.startsWith(col.id)
    );
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id.toString();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      setActiveTask(task);
      // Store the original tasks array at drag start
      tasksBeforeDragRef.current = [...tasks];
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeTask) return;

    let targetStatus: string | undefined;
    
    // 1. Check if dropped on a column
    if (over.data.current?.type === 'column') {
      targetStatus = over.data.current.status;
    } 
    // 2. Check if dropped on a task
    else if (over.data.current?.type === 'task') {
      targetStatus = over.data.current.task.status;
    }
    // 3. Handle empty columns by checking column IDs directly
    else if (typeof over.id === 'string' && over.id.startsWith('col-')) {
      const column = initialColumnsData.find(c => c.id === over.id);
      targetStatus = column?.status;
    }

    // Update activeTask for visual feedback
    if (targetStatus && activeTask.status !== targetStatus) {
      setActiveTask({ ...activeTask, status: targetStatus });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!active || !over) {
      setTasks(tasksBeforeDragRef.current);
      return;
    }

    const activeId = active.id.toString();
    const originalTask = tasksBeforeDragRef.current.find(t => t.id === activeId);
    if (!originalTask) {
      setTasks(tasksBeforeDragRef.current);
      return;
    }

    // Get target status
    let targetStatus: string | undefined;
    
    if (over.data.current?.type === 'column') {
      targetStatus = over.data.current.status;
    } 
    else if (over.data.current?.type === 'task') {
      targetStatus = over.data.current.task.status;
    }
    else if (typeof over.id === 'string' && over.id.startsWith('col-')) {
      const column = initialColumnsData.find(c => c.id === over.id);
      targetStatus = column?.status;
    }

    if (!targetStatus) {
      setTasks(tasksBeforeDragRef.current);
      return;
    }

    const statusChanged = originalTask.status !== targetStatus;
    let orderChanged = false;
    let newOrderPayload: string[] = [];

    // Check for order changes only if status didn't change
    if (!statusChanged) {
      const originalColumnTasks = tasksBeforeDragRef.current
        .filter(t => t.status === originalTask.status)
        .map(t => t.id);

      const currentColumnTasks = tasks
        .filter(t => t.status === originalTask.status)
        .map(t => t.id);

      if (JSON.stringify(originalColumnTasks) !== JSON.stringify(currentColumnTasks)) {
        orderChanged = true;
        newOrderPayload = currentColumnTasks;
      }
    }

    try {
      // Update status if changed
      if (statusChanged) {
        // Update local state immediately for responsive UI
        const updatedTasks = tasks.map(task => 
          task.id === activeId ? { ...task, status: targetStatus! } : task
        );
        setTasks(updatedTasks);

        // Send API update
        await updateTaskInStore(activeId, { status: targetStatus });
      }

      // Update order if changed
      if (orderChanged) {
        console.log('Order changed in column:', originalTask.status, newOrderPayload);
        // Implement your order update API here
      }
      
      // Refresh tasks after update to ensure consistency
      if (sprintId) {
        getTasks(sprintId);
      }
    } catch (error) {
      console.error("Update failed:", error);
      setTasks(tasksBeforeDragRef.current);
    }
  };

  const handleFilterChange = (selectedUserId: string | null): void => {
    if (selectedUserId) {
      if (sprintId) {
        getTasks(sprintId, { assignee_id: selectedUserId });
      }
    } else {
      if (sprintId) {
        getTasks(sprintId);
      }
    }
};

  return (
    <main className="flex-1 flex flex-col p-6 bg-white overflow-hidden">
      {/* Header Papan */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-gray-500">Sprint / Chatbot for Customer Support</p>
          <h1 className="text-2xl font-semibold text-gray-800">Sprint 1</h1>
        </div>
      </div>

      {tasksState.type === 'Loading' && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* <div className="relative"><MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search" className="pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div> */}
          <UserFilter onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Only render DndContext when tasks are successfully loaded */}
      {tasksState.type === 'Success' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 h-full items-start">
            {columns.map(column => {
              const columnTasks = tasks.filter(task => task.status === column.status);
              return (
                <KanbanColumn key={column.id} column={{ ...column, tasks: columnTasks }} />
              );
            })}
          </div>

          <DragOverlay dropAnimation={null} style={{ pointerEvents: 'none' }}>
            {activeTask ? (
              <KanbanCard
                task={activeTask}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Quickstart button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center text-sm"><StarIconOutline className="h-5 w-5 mr-2" /> Quickstart</button>
    </main>
  );
};

export default BoardContent;