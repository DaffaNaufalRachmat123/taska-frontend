import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import { AxiosError } from "axios";
import axiosInstance from "../../configApi";
import { UserListResponse, UserResponse } from "../../interfaces/user-interface";

export interface UserState {
    userState: ViewState<UserListResponse>;
    user: () => Promise<void>;
    resetState: () => void
    meState : ViewState<UserResponse>;
    me: () => Promise<void>;
}

const storeUserApi: StateCreator<UserState> = (set, get) => ({
    userState: { type: 'Idle' },
    user: async () => {
        try {
            set({
                userState: {
                    type: 'Loading'
                }
            })

            const { data } = await axiosInstance.get<UserListResponse>(`/v1/users`)
            set({
                userState: {
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
                            userState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            userState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        userState: {
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
            userState : { type : 'Idle' },
            meState : { type : 'Idle' }
        })
    },
    meState: { type: 'Idle' },
    me: async () => {
        try {
            set({
                meState: {
                    type: 'Loading'
                }
            })

            const { data } = await axiosInstance.get<UserResponse>(`/v1/users/me`)
            console.log(`CREDENTIAL DATA : ${JSON.stringify(data , null , 2)}`)
            set({
                meState: {
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
                            meState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            meState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        meState: {
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

export const useUserStore = create<UserState>()(
    storeUserApi
)