// src/components/TaskList.tsx
import React from 'react';
import TaskItem from './TaskItem';
import { Task } from './types/Task';

const tasksData: Task[] = [
  { id: 'CCS-5', title: '[Sample] Implement NLP Engine', project: 'Chatbot for Customer Support', type: 'completed' },
  { id: 'CCS-6', title: '[Sample] Design Chatbot Personality', project: 'Chatbot for Customer Support', type: 'completed' },
  { id: 'CCS-3', title: '[Sample] Develop Frontend Interface', project: 'Chatbot for Customer Support', type: 'completed' },
  { id: 'CCS-4', title: '[Sample] Create User Flow Diagram', project: 'Chatbot for Customer Support', type: 'completed' },
  { id: 'CCS-1', title: '[Sample] User Interaction Design', project: 'Chatbot for Customer Support', type: 'new' },
  { id: 'CCS-2', title: '[Sample] Chatbot Development', project: 'Chatbot for Customer Support', type: 'new' },
];

const TaskList: React.FC = () => {
  return (
    // Menghilangkan p-6, bg-gray-50, overflow-y-auto dari sini karena akan dihandle parent
    // flex-grow akan membuat komponen ini mengisi ruang vertikal yang tersedia di bawah kartu
    <div className="flex-grow"> 
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        IN THE LAST MONTH
      </h3>
      <div className="bg-white shadow rounded-lg">
        {tasksData.map(task => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            project={task.project}
            type={task.type}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;