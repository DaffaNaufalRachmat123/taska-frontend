import { FormEvent, Reducer, useEffect, useReducer, useState } from "react";
import { useAuthStore } from "../stores/auth/auth.store"
import Spinner from "../components/utilities/Loading";
import AnimatedCheck from "../components/views/AnimatedCheck";
import { useNavigate } from "react-router-dom";
import { RegisterRequest } from "../interfaces/auth-interface";
import TaskaMainLogo from '../assets/logo/taska_main_logo.png';
import TaskaTextLogo from '../assets/logo/taska_text_logo.png';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal)

export const AuthRegisterPage = () => {
    const register = useAuthStore((store) => store.register)
    const registerState = useAuthStore((store) => store.registerState)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isLoggedIn = useAuthStore((store) => store.isLoggedIn)

    const resetState = useAuthStore((store) => store.resetState)
    const [submit, setSubmit] = useState<boolean>(false)
    const [registerStatus, setRegisterStatus] = useState<boolean>(false)

    const navigate = useNavigate()

    const reducer: Reducer<FormState, FormAction> = (state, newState) => {
        return { ...state, ...newState };
    };

    const [inputValues, setInputValues] = useReducer(reducer, initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputValues({ [name]: value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmit(true)

        if (getEmailError() == null && inputValues.email != '' && inputValues.password != '' &&
            inputValues.confirmPassword != '' && inputValues.name != '' &&
            inputValues.organization_code != ''
        ) {
            if(inputValues.password == inputValues.confirmPassword){
                const request: RegisterRequest = {
                    email: inputValues.email,
                    password: inputValues.password,
                    confirmPassword: inputValues.confirmPassword,
                    name: inputValues.name,
                    organization_code: inputValues.organization_code
                }
                register(request)
            }
        }
    }

    useEffect(() => {
        switch (registerState.type) {
            case 'Success':
                setRegisterStatus(true)
                break;
            case 'Failed':
                setRegisterStatus(true)
                MySwal.fire(
                    'Status',
                    registerState.message ?? "",
                    'error'
                )
                resetState()
                break;
        }
    }, [registerState])

    useEffect(() => {
        if (isLoggedIn) {
            setTimeout(() => { 
                navigate('/')
                resetState()
            }, 450)
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (registerStatus) {
            setTimeout(() => { setRegisterStatus(false) }, 1300)
        }
    }, [registerStatus])

    const buildRegisterStatus = () => {
        switch (registerState.type) {
            case 'Success':
                return (
                    <div className={`absolute z-50 bg-green-600 text-white text-xs slide-down w-full text-center flex items-center justify-center ${registerStatus ? 'slide-down' : 'slide-up'}`}>
                        Berhasil mendaftar
                    </div>
                )
            case 'Failed':
                return (
                    <div className={`absolute z-50 bg-red-600 text-white text-xs slide-down w-full text-center flex items-center justify-center ${registerStatus ? 'slide-down' : 'slide-up'}`}>
                        {registerState.message}
                    </div>
                )
            default:
                return (<></>)
        }
    }

    const buildRegisterButton = () => {
        switch (registerState.type) {
            case 'Loading':
                return (
                    <div className="relative" style={{ marginTop: '20px', height: '3.5rem' }}>
                        <Spinner size="md" color="#000000" cover="parent" />
                    </div>
                )
            case 'Success':
                return (
                    <div className="relative" style={{ marginTop: '20px', height: '3.5rem' }}>
                        <AnimatedCheck type="check" duration={0.4} width="4em" height="4em" />
                    </div>
                )
            default:
                return (
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="mt-5 tracking-wide font-semibold bg-[#136bab] text-gray-100 w-full py-4 rounded-lg hover:bg-[#095e9a] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                        <span className="ml-3">Register</span>
                    </button>
                )
        }
    }

    const getEmailError = () => {
        if (inputValues.email === '') {
            return 'Please enter an email';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(inputValues.email)) {
            return 'Email not valid';
        }

        return null; 
    };

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Top Navbar */}
            <div>
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-5">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <img
                                    style={{ width: '70px', height: '60px' }}
                                    src={TaskaTextLogo}
                                    alt="Suberes Text Logo"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Form */}
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white shadow-xl sm:rounded-lg justify-center relative overflow-hidden">
                    {buildRegisterStatus()}
                    <div className="p-6 sm:p-12">
                        <div className="flex flex-col items-center">
                            {/* Using a placeholder for the logo */}
                            <img
                                className="w-40 h-40"
                                src={TaskaMainLogo}
                                alt="Logo"
                            />
                            <h1 className="text-2xl font-semibold text-blue-600 mt-4 mb-4">
                                Daftar
                            </h1>
                            <div className="w-full flex-1 mt-4">
                                <div className="mx-auto max-w-xs">
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-5">
                                            <input
                                                className={`w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border ${submit && (inputValues.email == '' || getEmailError() != null) ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={inputValues.email}
                                                onChange={handleChange}
                                            />
                                            {submit && getEmailError() && (
                                                <p className="text-xs text-red-500 mt-1">{getEmailError()}</p>
                                            )}
                                        </div>
                                        <div className="relative mb-5">
                                            <input
                                                className={`w-full px-4 py-4 pr-10 rounded-lg font-medium bg-gray-100 border ${submit && inputValues.password === '' ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                value={inputValues.password}
                                                onChange={handleChange}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                                                {!showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                            </button>
                                        </div>
                                        {submit && inputValues.password == '' && (
                                            <p className="text-xs text-red-500 mt-1 -translate-y-4">Please enter password</p>
                                        )}

                                        <div className="relative mb-5">
                                            <input
                                                className={`w-full px-4 py-4 pr-10 rounded-lg font-medium bg-gray-100 border ${submit && (inputValues.confirmPassword === '' || inputValues.confirmPassword !== inputValues.password) ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Confirm password"
                                                value={inputValues.confirmPassword}
                                                onChange={handleChange}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                                                {!showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                            </button>
                                            {submit && inputValues.confirmPassword === '' && (
                                                <p className="text-xs text-red-500 mt-1">Please enter confirm password</p>
                                            )}
                                            {submit && inputValues.confirmPassword !== '' && inputValues.password !== inputValues.confirmPassword && (
                                                <p className="text-xs text-red-500 mt-1">Confirm password not match</p>
                                            )}
                                        </div>
                                        <div className="mb-5">
                                            <input
                                                className={`w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border ${submit && inputValues.name == '' ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                                                type="name"
                                                name="name"
                                                placeholder="Name"
                                                value={inputValues.name}
                                                onChange={handleChange}
                                            />
                                            {submit && inputValues.name == '' && (
                                                <p className="text-xs text-red-500 mt-1">Please enter your name</p>
                                            )}
                                        </div>
                                        <div className="mb-5">
                                            <input
                                                className={`w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border ${submit && inputValues.organization_code == '' ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                                                type="organization_code"
                                                name="organization_code"
                                                placeholder="Organization Code"
                                                value={inputValues.organization_code}
                                                onChange={handleChange}
                                            />
                                            {submit && inputValues.organization_code == '' && (
                                                <p className="text-xs text-red-500 mt-1">Please enter organization code</p>
                                            )}
                                        </div>
                                        {buildRegisterButton()}
                                        <p className="mt-6 text-sm text-gray-600 text-center">
                                            Sudah punya akun?{' '}
                                            <a style={{ cursor : 'pointer' }} onClick={() => {
                                                navigate(-1)
                                            }} className="font-semibold text-blue-600 hover:text-blue-800">
                                                Masuk di sini
                                            </a>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Bottom Navbar */}
            <div>
                <div className="bg-white border-t border-gray-200">
                    <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-5">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex justify-center items-center space-x-1">
                                <span className="text-sm text-gray-500">© 2025</span>
                                <span className="text-sm text-blue-500">Taska Team</span>
                            </div>
                            <div className="flex-1 flex items-center justify-end space-x-4">
                                <div className="relative">
                                    <p className="text-sm text-gray-400">Taska Team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.89-11-8 1.02-2.43 2.79-4.53 4.94-5.94M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M1 1l22 22" />
        <path d="M12 4c5 0 9.27 3.89 11 8a11.08 11.08 0 0 1-2.07 3.11" />
    </svg>
);

interface FormState {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    organization_code: string;
}

const initialState: FormState = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization_code: ''
};

type FormAction = Partial<FormState>;