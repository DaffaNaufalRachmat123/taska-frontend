import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import { AxiosError } from "axios";
import { devtools, persist } from 'zustand/middleware'
import axiosInstance from "../../configApi";
import { SprintResponse } from "../../interfaces/sprint-interface";

export interface SprintState {
    currSprintState: ViewState<SprintResponse>;
    currentSprint: () => Promise<void>;
    resetState: () => void
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
    }
})

export const useSprintStore = create<SprintState>()(
    storeSprintApi
)