import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import { AxiosError } from "axios";
import { devtools, persist } from 'zustand/middleware'
import axiosInstance from "../../configApi";
import { SprintListResponse, SprintResponse } from "../../interfaces/sprint-interface";

export interface SprintState {
    currSprintState: ViewState<SprintResponse>;
    currentSprint: () => Promise<void>;
    resetState: () => void
    sprintList: (filter?: Record<string, any>) => Promise<void>;
    sprintListState: ViewState<SprintListResponse>;
    sprintConfig: () => Promise<void>;
    sprintConfigState: ViewState<SprintListResponse>;
}

const storeSprintApi: StateCreator<SprintState> = (set) => ({
    currSprintState: { type: 'Idle' },
    currentSprint: async () => {
        try {
            set({
                currSprintState: {
                    type: 'Loading'
                }
            })

            const { data } = await axiosInstance.get<SprintResponse>(`/v1/sprint/current`)
            set({
                currSprintState: {
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
                            currSprintState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            currSprintState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        currSprintState: {
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
            currSprintState : { type : 'Idle' }
        })
    },
    sprintList: async (filter?: Record<string, any>) => {
        try {
            set({
                sprintListState: {
                    type: 'Loading'
                }
            })

            const paramsString = filter && new URLSearchParams(filter).toString();
            const { data } = await axiosInstance.get<SprintListResponse>(`/v1/sprint/list?${paramsString || ''}`)
            set({
                sprintListState: {
                    type: 'Success',
                    data: data
                },
            })
        } catch (error) {
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status === 400) {
                        set({
                            sprintListState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            sprintListState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        sprintListState: {
                            type: 'Failed',
                            message: 'Unknown Error',
                            code: 404
                        }
                    })
                }
            }, 200)
        }
    },
    sprintListState: { type: 'Idle' },
    sprintConfigState: { type: 'Idle' },
    sprintConfig: async () => {
        try {
            set({
                sprintConfigState: {
                    type: 'Loading'
                }
            })

            const { data } = await axiosInstance.get<SprintListResponse>(`/v1/sprint/config`)
            set({
                sprintConfigState: {
                    type: 'Success',
                    data: data
                },
            })
        } catch (error) {
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status === 400) {
                        set({
                            sprintConfigState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            sprintConfigState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        sprintConfigState: {
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

export const useSprintStore = create<SprintState>()(
    storeSprintApi
)