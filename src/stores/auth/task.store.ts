import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import { AxiosError } from "axios";
import axiosInstance from "../../configApi";
import { TaskDeleteResponse, TaskFormData, TaskListResponse, TaskResponse } from "../../interfaces/task-interface";
import { objectToParams } from "../../helpers/generateUrlParams";

export interface TaskState {
    taskState: ViewState<TaskListResponse>;
    task: (sprintID: string, filter?: Record<string, any>) => Promise<void>;
    resetState: () => void
    updateTask: (taskID: string, data: any) => Promise<void>;
    updateState: ViewState<{ updated_row: number }>;
    createTask: (data: TaskFormData) => Promise<void>;
    createTaskState: ViewState<any>;
    taskDetail: (taskID: string) => Promise<void>;
    taskDetailState: ViewState<TaskResponse>;
    resetTaskDetailState: () => void;

    deleteTaskState: ViewState<TaskDeleteResponse>;
    deleteTask: (id: string) => Promise<void>;

    removeTaskItemFromList: (id: string) => void;
}

const storeTaskApi: StateCreator<TaskState> = (set, get) => ({
    taskState: { type: 'Idle' },
    task: async (sprintID: string, filter?: Record<string, string>) => {
        try {
            set({
                taskState: {
                    type: 'Loading'
                }
            })

            const paramsString = filter && objectToParams(filter)
            const { data } = await axiosInstance.get<TaskListResponse>(`/v1/task/list/${sprintID}?${paramsString || ''}`)
            set({
                taskState: {
                    type: 'Success',
                    data: data
                },
            })
        } catch (error) {
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status == 400) {
                        set({
                            taskState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            taskState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        taskState: {
                            type: 'Failed',
                            message: 'Unknown Error',
                            code: 404
                        }
                    })
                }
            }, 200)
        }
    },
    resetState: () => {
        set({
            taskState: { type: 'Idle' }
        })
    },
    updateState: { type: 'Idle' },
    updateTask: async (taskID: string, data: string) => {
        try {
            set({
                updateState: {
                    type: 'Loading'
                }
            })

            const { data: responseData } = await axiosInstance.put<{ updated_row: number }>(`/v1/task/${taskID}`, data)
            set({
                updateState: {
                    type: 'Success',
                    data: responseData
                }
            })
        } catch (error) {
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status === 400) {
                        set({
                            updateState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            updateState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        updateState: {
                            type: 'Failed',
                            message: 'Unknown Error',
                            code: 404
                        }
                    })
                }
            }, 200)
        }
    },
    createTask: async (data: TaskFormData) => {
        try {
            set({
                createTaskState: {
                    type: 'Loading'
                }
            })

            const { data: responseData } = await axiosInstance.post<TaskListResponse>(`/v1/task`, data)
            set({
                createTaskState: {
                    type: 'Success',
                    data: responseData
                }
            })
        } catch (error) {
            setTimeout(() => {
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status === 400) {
                        set({
                            createTaskState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            createTaskState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        createTaskState: {
                            type: 'Failed',
                            message: 'Unknown Error',
                            code: 404
                        }
                    })
                }
            }, 200)
        }
    },
    createTaskState: { type: 'Idle' },
    taskDetail: async (taskID: string) => {
        try {
            set({
                taskDetailState: {
                    type: 'Loading'
                }
            })

            const { data } = await axiosInstance.get<TaskResponse>(`/v1/task/${taskID}`)
            set({
                taskDetailState: {
                    type: 'Success',
                    data: data
                }
            })
        } catch (error) {
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status == 400) {
                        set({
                            taskDetailState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            taskDetailState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        taskDetailState: {
                            type: 'Failed',
                            message: 'Unknown Error',
                            code: 404
                        }
                    })
                }
            }, 200)
        }
    },
    taskDetailState: { type: 'Idle' },
    resetTaskDetailState: () => {
        set({
            taskDetailState: { type: 'Idle' },
            updateState: { type: 'Idle' },
            deleteTaskState: { type: 'Idle' }
        })
    },
    deleteTaskState: { type: 'Idle' },
    deleteTask: async (id: string) => {
        try {
            set({
                deleteTaskState: {
                    type: 'Loading'
                }
            })
            const { data } = await axiosInstance.delete<TaskDeleteResponse>(`/v1/task/delete/${id}`)
            set({
                deleteTaskState: {
                    type: 'Success',
                    data: data
                }
            })
        } catch (error) {
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status == 400) {
                        set({
                            deleteTaskState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            deleteTaskState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        deleteTaskState: {
                            type: 'Failed',
                            message: 'Unknown Error',
                            code: 404
                        }
                    })
                }
            }, 200)
        }
    },
    removeTaskItemFromList: (id: string) => {
        const currentState = get().taskState;
        if (currentState.type === 'Success' && currentState.data) {

            // Buat array baru dengan memfilter keluar data yang ID-nya cocok
            const updatedDataArray = currentState.data.data.filter(task => task.id !== id);

            // Perbarui state `taskState` dengan array yang sudah tidak berisi data terhapus
            set({
                taskState: {
                    ...currentState,
                    data: {
                        ...currentState.data,
                        data: updatedDataArray
                    }
                }
            });
        }

    }
})

export const useTaskStore = create<TaskState>()(
    storeTaskApi
)