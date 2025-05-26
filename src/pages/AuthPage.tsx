import { FormEvent, useEffect, useState } from 'react';
import TaskaMainLogo from '../assets/logo/taska_main_logo.png';
import TaskaTextLogo from '../assets/logo/taska_text_logo.png';
import { useAuthStore } from '../stores/auth/auth.store';
import Spinner from '../components/utilities/Loading';
import '../assets/css/slideUpDown.css';
import { LoginRequest, LoginResponse } from '../interfaces/auth-interface';
import { useNavigate } from 'react-router-dom';
import AnimatedCheck from '../components/views/AnimatedCheck';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal)

export const AuthPage = () => {
    const loginAdmin = useAuthStore((state) => state.login);
    const resetState = useAuthStore((state) => state.resetState)
    const response = useAuthStore((state) => state.loginState);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (mail != '' && password != '') {
            const logReq: LoginRequest = {
                email: mail,
                password: password,
            };

            loginAdmin(logReq);
        }
    };

    useEffect(() => {
        if(isLoggedIn){
            setTimeout(() => { navigate('/admin') } , 450)
        }
    } , [isLoggedIn])

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

    const buildLoginStatus = () => {
        switch (response.type) {
            case 'Success':
                return (
                    <div className={`absolute z-50 bg-green-600 text-white text-xs slide-down w-full text-center flex items-center justify-center ${loginStatus ? 'slide-down' : 'slide-up'}`}>
                        {response.data.errors}
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

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Top Navbar */}
            <div>
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-5">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <img
                                    style={{ width: '70px', height: '50px' }}
                                    src={TaskaTextLogo}
                                    alt="Suberes Text Logo"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Form */}
            <div className="flex-grow flex items-center justify-center">
                <div className="inline-block m-0 sm:m-5 bg-white shadow-[10px_10px_15px_rgba(0,0,0,0.2)] sm:rounded-lg justify-center relative">
                    {buildLoginStatus()}
                    <div className="p-6 sm:p-12">
                        <div className="flex flex-col items-center">
                            <img
                                style={{ width: '200px', height: '200px' }}
                                src={TaskaMainLogo}
                                alt="Logo"
                            />
                            <div className="w-full flex-1 mt-8">
                                <div className="mx-auto max-w-xs">
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                            type="email"
                                            placeholder="Email"
                                            value={mail}
                                            onChange={(e) => setMail(e.target.value)}
                                        />
                                        <input
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {buildLoginButton()}
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
                                <span className="text-sm text-gray-500">© 2024</span>
                                <span className="text-sm text-blue-500">Suberes Team</span>
                            </div>
                            <div className="flex-1 flex items-center justify-end space-x-4">
                                <div className="relative">
                                    <p className="text-sm text-gray-400">Suberes Team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
