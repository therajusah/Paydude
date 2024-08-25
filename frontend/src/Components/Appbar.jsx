import { useNavigate } from 'react-router-dom';

export const Appbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin"); 
    };

    return (
        <div className="flex justify-between shadow h-14">
            <div className="flex flex-col justify-center h-full ml-4">
                PayDude
            </div>
            <div className="flex items-center">
                <button 
                    onClick={handleLogout} 
                    className="mr-4 text-sm font-medium text-gray-700"
                >
                    Logout
                </button>
                <div className="flex justify-center w-12 h-12 mt-1 mr-2 rounded-full bg-slate-200">
                    <div className="flex flex-col justify-center h-full text-xl">
                        U
                    </div>
                </div>
            </div>
        </div>
    );
};
