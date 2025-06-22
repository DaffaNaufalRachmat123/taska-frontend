import { FormEvent, useEffect, useState } from 'react';
import TaskaMainLogo from '../assets/logo/taska_main_logo.png';
import TaskaTextLogo from '../assets/logo/taska_text_logo.png';
import { useAuthStore } from '../stores/auth/auth.store';
import Spinner from '../components/utilities/Loading';
import '../assets/css/slideUpDown.css';
import { LoginRequest, LoginResponse } from '../interfaces/auth-interface';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedCheck from '../components/views/AnimatedCheck';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { ModalToast } from '../components/ModalToast';
const MySwal = withReactContent(Swal)

export const AuthLoginPage = () => {
    const login = useAuthStore((state) => state.login);
    const resetState = useAuthStore((state) => state.resetState)
    const response = useAuthStore((state) => state.loginState);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const sessionExpired = useAuthStore((state) => state.sessionExpired)
    const resetSessionExpired = useAuthStore((state) => state.resetSessionExpired)

    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<boolean>(false)
    const [submit, setSubmit] = useState<boolean>(false)
    const [mailError, setMailError] = useState<boolean>()
    const [passError, setPassError] = useState<boolean>()
    const navigate = useNavigate()

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setSubmit(true)

        if (mail == '') {
            setMailError(true)
        }

        if (password == '') {
            setPassError(true)
        }

        if (mail != '' && password != '') {
            const logReq: LoginRequest = {
                email: mail,
                password: password,
            };

            login(logReq);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            setTimeout(() => { navigate('/') }, 450)
        }
    }, [isLoggedIn])

    useEffect(() => {
        switch (response.type) {
            case 'Success':
                setLoginStatus(true)
                break;
            case 'Failed':
                setLoginStatus(true)
                MySwal.fire(
                    'Status',
                    'Gagal masuk',
                    'error'
                )
                resetState()
                break;
        }
    }, [response]);

    useEffect(() => {
        if (loginStatus) {
            setTimeout(() => { setLoginStatus(false) }, 1300)
        }
    }, [loginStatus])

    const [modalToast, setModalToast] = useState({
        show: false,
        message: '',
        type: null as 'success' | 'error' | null,
    });

    useEffect(() => {
        if (sessionExpired) {
            setModalToast({
                show : true,
                message : 'Sesi telah habis, silahkan login kembali',
                type : 'error'
            })
            resetSessionExpired()
        }
    }, [])

    const buildLoginStatus = () => {
        switch (response.type) {
            case 'Success':
                return (
                    <div className={`absolute z-50 bg-green-600 text-white text-xs slide-down w-full text-center flex items-center justify-center ${loginStatus ? 'slide-down' : 'slide-up'}`}>
                        {response.message}
                    </div>
                )
            case 'Failed':
                return (
                    <div className={`absolute z-50 bg-red-600 text-white text-xs slide-down w-full text-center flex items-center justify-center ${loginStatus ? 'slide-down' : 'slide-up'}`}>
                        {response.message}
                    </div>
                )
            default:
                return (<></>)
        }
    }

    const buildLoginButton = () => {
        switch (response.type) {
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
                        <span className="ml-3">Log in</span>
                    </button>
                )
        }
    }

    useEffect(() => {
        if (modalToast.show) {
            const timer = setTimeout(() => {
                setModalToast(prev => ({ ...prev, show: false }));
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [modalToast.show]);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <ModalToast
                message={modalToast.message}
                type={modalToast.type}
                show={modalToast.show}
            />
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
                    {buildLoginStatus()}
                    <div className="p-6 sm:p-12">
                        <div className="flex flex-col items-center">
                            {/* Using a placeholder for the logo */}
                            <img
                                className="w-40 h-40"
                                src={TaskaMainLogo}
                                alt="Logo"
                            />
                            <h1 className="text-2xl font-semibold text-blue-600 mt-4 mb-4">
                                Masuk
                            </h1>
                            <div className="w-full flex-1 mt-4">
                                <div className="mx-auto max-w-xs">
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-5">
                                            <input
                                                className={`w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border ${submit && mailError ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                                                type="email"
                                                placeholder="Email"
                                                value={mail}
                                                onChange={(e) => {
                                                    setMail(e.target.value);
                                                    setMailError(e.target.value.length == 0)
                                                }}
                                            />
                                            {submit && mailError && (
                                                <p className="text-xs text-red-500 mt-1">Please enter an email</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                className={`w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border ${submit && passError ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    setPassError(e.target.value.length == 0)
                                                }}
                                            />
                                            {submit && passError && (
                                                <p className="text-xs text-red-500 mt-1">Please enter password</p>
                                            )}
                                        </div>
                                        {buildLoginButton()}
                                        <p className="mt-6 text-sm text-gray-600 text-center">
                                            Belum punya akun?{' '}
                                            <a style={{ cursor: 'pointer' }} onClick={() => {
                                                navigate('/auth/register')
                                            }} className="font-semibold text-blue-600 hover:text-blue-800">
                                                Daftar di sini
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
    );
};
