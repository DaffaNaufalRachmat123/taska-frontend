// src/components/TaskList.tsx
import React, { use, useEffect } from 'react';
import TaskItem from './TaskItem';
import { useTaskStore } from '../stores/auth/task.store';


const TaskList: React.FC<{sprint_id: string; sprint_name: string}> = ({ sprint_id, sprint_name }) => {
  const tasks = useTaskStore((state) => state.taskState);
  const getTasks = useTaskStore((state) => state.task);

  useEffect(() => {
    if (!tasks || tasks.type === 'Idle') {
      getTasks(sprint_id);
    }
  }, [sprint_id]);

  console.log(tasks)

  return (
    // Menghilangkan p-6, bg-gray-50, overflow-y-auto dari sini karena akan dihandle parent
    // flex-grow akan membuat komponen ini mengisi ruang vertikal yang tersedia di bawah kartu
    <div className="flex-grow"> 
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        IN THIS SPRINT
      </h3>
      <div className="bg-white shadow rounded-lg">
        {tasks.data?.data.map(task => (
          <TaskItem
            key={task.id}
            id={task.id}
            name={task.name}
            sprint={sprint_name}
            status={task.status}
            type={task.type}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;