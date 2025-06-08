import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import { AxiosError } from "axios";
import axiosInstance from "../../configApi";
import { TaskListResponse } from "../../interfaces/task-interface";

export interface TaskState {
    taskState: ViewState<TaskListResponse>;
    task: (sprintID: string) => Promise<void>;
    resetState: () => void
    updateTask: (taskID: string, data: any) => Promise<void>;
    updateState: ViewState<{ updated_row: number }>;
}

const storeTaskApi: StateCreator<TaskState> = (set, get) => ({
    taskState: { type: 'Idle' },
    task: async (sprintID: string) => {
        try {
            set({
                taskState: {
                    type: 'Loading'
                }
            })

            const { data } = await axiosInstance.get<TaskListResponse>(`/v1/task/list/${sprintID}`)
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
    resetState : () => {
        set({
            taskState : { type : 'Idle' }
        })
    },
    updateState: { type: 'Idle' },
    updateTask: async (taskID: string, data: any) => {
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
    }
})

export const useTaskStore = create<TaskState>()(
    storeTaskApi
)