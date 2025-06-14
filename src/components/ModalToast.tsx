export const ModalToast: React.FC<{
    message: string;
    type: 'success' | 'error' | null;
    show: boolean;
}> = ({ message, type, show }) => {
    const typeClasses = {
        success: { bg: 'bg-green-500', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        error: { bg: 'bg-red-500', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
    };

    return (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-auto transition-all duration-300 ease-in-out z-20 ${show && type ? 'translate-y-6 opacity-100' : '-translate-y-full opacity-0'}`} >
             {type && (
                <div className={`${typeClasses[type].bg} text-white text-sm font-semibold rounded-lg shadow-lg py-3 px-5 flex items-center`}>
                    {typeClasses[type].icon}
                    {message}
                </div>
             )}
        </div>
    );
};