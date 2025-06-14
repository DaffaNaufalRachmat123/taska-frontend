export const ErrorContainer: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Gagal Memuat Sprint</h3>
        <p className="text-gray-500 mb-6 max-w-sm">Terjadi kesalahan saat mengambil data. Silakan periksa koneksi Anda dan coba lagi.</p>
        <button
            onClick={onRetry}
            className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors"
        >
            Coba Lagi
        </button>
    </div>
);
