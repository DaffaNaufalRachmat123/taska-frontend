import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import { LoginRequest, LoginResponse } from "../../interfaces/auth-interface";
import { AxiosError } from "axios";
import { devtools, persist } from 'zustand/middleware'
import axiosInstance from "../../configApi";

export interface AuthState {
    loginState: ViewState<LoginResponse>;
    isLoggedIn: boolean;
    token: string;
    login: (request: LoginRequest) => Promise<void>;
    resetState: () => void
}

const storeAuthApi: StateCreator<AuthState> = (set) => ({
    loginState: { type: 'Idle' },
    isLoggedIn: false,
    token: '',
    login: async (request: LoginRequest) => {
        try {
            set({
                loginState: {
                    type: 'Loading'
                }
            })
            const { data } = await axiosInstance.post<LoginResponse>('/v1/auth/login', {
                email: request.email,
                password: request.password
            })
            set({
                loginState: {
                    type: 'Success',
                    data: data
                },
                isLoggedIn: true,
                token: data.data.token
            })
        } catch (error) {
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status == 400) {
                        set({
                            loginState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else {
                        set({
                            loginState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        loginState: {
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
            loginState : { type : 'Idle' }
        })
    }
})

export const useAuthStore = create<AuthState>()(
    devtools(persist(
        storeAuthApi, { name: 'auth-storage' }
    ))
)