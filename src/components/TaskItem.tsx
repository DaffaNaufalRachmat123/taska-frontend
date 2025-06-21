// src/components/TaskItem.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { TaskData, TaskFormData } from '../interfaces/task-interface';
import { ArrowPathIcon, BugAntIcon, EllipsisVerticalIcon, TicketIcon, UserCircleIcon, DocumentMagnifyingGlassIcon, BeakerIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import TaskCreationModal from './TaskCreationModal';
import { SprintData } from '../interfaces/sprint-interface';
import { useTaskStore } from '../stores/auth/task.store';
import { TaskDetailModal } from './TaskDetailModal';
import { ModalToast } from './ModalToast';
import { useAuthStore } from '../stores/auth/auth.store';

interface TaskItemProps {
  task: TaskData;
  onDeleteFromList: (task: TaskData) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDeleteFromList }) => {
  const role = useAuthStore((state) => state.role)
  // Destructure all needed properties from the task object
  const { id, name, status, type, assignee_name, reporter_name } = task;

  // Helper to determine the main status icon and color
  const getStatusInfo = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { Icon: CheckCircleIcon, color: 'text-green-500' };
      case 'in_progress':
        return { Icon: ArrowPathIcon, color: 'text-purple-500' };
      case 'in_review':
        return { Icon: DocumentMagnifyingGlassIcon, color: 'text-yellow-500' };
      case 'in_testing':
        return { Icon: BeakerIcon, color: 'text-blue-500' };
      default:
        return { Icon: type.toLowerCase() === 'bug' ? BugAntIcon : TicketIcon, color: type.toLowerCase() === 'bug' ? 'text-red-500' : 'text-blue-500' };
    }
  };

  const { Icon: StatusIcon, color: statusColor } = getStatusInfo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTaskState = useTaskStore((state) => state.deleteTaskState)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const getTask = useTaskStore((state) => state.task);
  const resetState = useTaskStore((state) => state.resetState)

  const handleOpenAddTaskModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTask = async (payload: TaskFormData) => {
    await updateTask(task.id, payload)

    if (task.sprint_id) {
      getTask(task.sprint_id);
    }

    handleCloseModal();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenAddTaskModal()
  };

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenDetailModal = () => {
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
  };

  const handleTaskClick = () => {
    handleOpenDetailModal();
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteModalToast, setDeleteModalToast] = useState({
    show: false,
    message: '',
    type: null as 'success' | 'error' | null
  })
  const [toastState, setToastState] = useState({
    show: false,
    message: '',
    type: null as 'success' | 'error' | null
  })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  const handleDeleteClick = () => {
    deleteTask(task.id)
  }

  useEffect(() => {
    switch (deleteTaskState.type) {
      case 'Loading':
        setDeleteLoading(true)
        console.log(`[+] LOADING DELETE TASK STATE [+]`)
        break
      case 'Success':
        setDeleteLoading(false)
        setDeleteModalOpen(false)
        setToastState({ show: true, message: 'Berhasil menghapus task', type: 'success' })
        // Remove task 
        onDeleteFromList(task)
        //resetState()
        console.log(`[+] LOADING SUCCESS TASK STATE [+]`)
        break
      case 'Failed':
        setDeleteLoading(false)
        setDeleteModalToast({ show: true, message: deleteTaskState.message ?? 'Unknown Error', type: 'error' })
        console.log(`[+] LOADING FAILED TASK STATE [+]`)
        break
    }
  }, [deleteTaskState])

  useEffect(() => {
    if (deleteModalToast.show) {
      const timer = setTimeout(() => {
        setDeleteModalToast(prev => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [deleteModalToast.show]);

  useEffect(() => {
    if (toastState.show) {
      const timer = setTimeout(() => {
        setToastState(prev => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastState.show]);

  return (
    // Add 'group' to enable group-hover for the action button
    <div className="group flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors">
      <ModalToast message={toastState.message} type={toastState.type} show={toastState.show} />
      {/* Left Side: Icon, Name, Reporter, ID */}
      <div className="flex items-center">
        <StatusIcon className={`h-5 w-5 ${statusColor} mr-3 flex-shrink-0`} />
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">
            {reporter_name ? `${reporter_name} • ` : ''}{id}
          </p>
        </div>
      </div>

      {/* Right Side: Assignee Avatar and Action Button */}
      <div className="flex items-center space-x-3">
        {/* Assignee Avatar with Initial */}
        {assignee_name ? (
          (() => {
            // Simple color hashing for consistent avatar colors
            const colors = ['bg-red-100 text-red-700', 'bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-purple-100 text-purple-700'];
            const color = colors[assignee_name.charCodeAt(0) % colors.length];
            return (
              <div title={assignee_name} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>
                {assignee_name.charAt(0).toUpperCase()}
              </div>
            );
          })()
        ) : (
          <UserCircleIcon className="h-6 w-6 text-gray-300" title="Unassigned" />
        )}

        {/* Action Button - Selalu Terlihat */}
        {role === "admin" && (
          <button
            onClick={handleEditClick}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        )}

        {/* Tombol Detail - Selalu Terlihat */}
        <button
          onClick={handleTaskClick}
          className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
        >
          <DocumentMagnifyingGlassIcon className="h-5 w-5" />
        </button>
        {role === "admin" && (
          <button
            onClick={handleDeleteModalOpen}
            className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      { /** Modal Edit Task */}
      <TaskCreationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        sprintID={task.sprint_id as string}
        taskToEdit={task}
      />

      { /** Modal Task Detail */}
      <TaskDetailModal key={task.id} taskId={task.id} isOpen={detailModalOpen} onClose={handleCloseDetailModal} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteClick}
        taskName={task.name}
        isLoading={deleteLoading}
        toastState={deleteModalToast} />
    </div>
  );
};

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
  isLoading: boolean;
  toastState: { show: boolean; message: string; type: 'success' | 'error' | null; };
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskName,
  isLoading,
  toastState
}) => {
  if (!isOpen) return null;

  // Mencegah penutupan modal saat tombol di dalam modal diklik
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center p-4"
      onClick={onClose} // Menutup modal saat area luar diklik
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden"
        onClick={handleModalContentClick}
      >
        <ModalToast message={toastState.message} type={toastState.type} show={toastState.show} />
        {/* Indikator Loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex justify-center items-center z-10 rounded-lg">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        )}

        {/* Header Modal */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Konfirmasi Penghapusan</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Tutup modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-base text-gray-600">
            Kamu yakin ingin menghapus task <br />
            <strong className="font-semibold text-gray-800">"{taskName}"</strong> ini?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Aksi ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Footer dengan Tombol Aksi */}
        <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};


export default TaskItem;