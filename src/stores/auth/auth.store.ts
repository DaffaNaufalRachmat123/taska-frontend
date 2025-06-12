import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../interfaces/auth-interface";
import { AxiosError } from "axios";
import { devtools, persist } from 'zustand/middleware'
import axiosInstance from "../../configApi";

export interface AuthState {
    loginState: ViewState<LoginResponse>;
    registerState : ViewState<RegisterResponse>;
    isLoggedIn: boolean;
    role : string;
    token: string;
    login: (request: LoginRequest) => Promise<void>;
    register : (request : RegisterRequest) => Promise<void>;
    logout: () => void;
    resetState: () => void
}

const storeAuthApi: StateCreator<AuthState> = (set) => ({
    loginState: { type: 'Idle' },
    registerState : { type : 'Idle' },
    isLoggedIn: false,
    role : '',
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
                role : data.data.role,
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
    register : async(request : RegisterRequest) => {
        try {
            set({
                registerState : {
                    type : 'Idle'
                }
            })
            const { data } = await axiosInstance.post<RegisterResponse>(`/v1/auth/register` , {
                email : request.email,
                password : request.password,
                confirmPassword : request.confirmPassword,
                name : request.name,
                organization_code : request.organization_code
            })
            set({
                registerState : {
                    type : 'Success',
                    data : data
                },
                isLoggedIn : true,
                token : data.data.token
            })
        } catch (error){
            setTimeout(() => {
                console.error(error)
                if (error instanceof AxiosError) {
                    const status = error.response?.status
                    if (status == 400) {
                        set({
                            registerState: {
                                type: 'Failed',
                                message: 'Bad Request from user',
                                code: 400
                            }
                        })
                    } else if(status == 404){
                        set({
                            registerState : {
                                type : 'Failed',
                                message : 'Kode organisasi tidak ditemukan',
                                code : 404
                            }
                        })
                    } else {
                        set({
                            registerState: {
                                type: 'Failed',
                                message: error.response ? error.response.data.server_message : 'Unknown Error',
                                code: error.response ? error.response.status : 404
                            }
                        })
                    }
                } else {
                    set({
                        registerState: {
                            type: 'Failed',
                            message: 'Unknown Error',
                            code: 404
                        }
                    })
                }
            } , 200)
        }
    },
    logout : () => {
        set({
            loginState : { type : 'Idle' },
            isLoggedIn : false,
            token : ''
        })
    },
    resetState : () => {
        set({
            loginState : { type : 'Idle' },
            registerState : { type : 'Idle' }
        })
    }
})

export const useAuthStore = create<AuthState>()(
    devtools(persist(
        storeAuthApi, { name: 'auth-storage' }
    ))
)