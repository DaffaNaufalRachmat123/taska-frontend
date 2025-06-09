import React, { useEffect, useState } from 'react';
import { useUserStore } from '../stores/auth/user.store';


type UserFilterProps = {
    onFilterChange: (userId: string | null) => void;
};

const bgColorSchema = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
    // Add more colors as needed
]


const UserFilter: React.FC<UserFilterProps> = ({ onFilterChange }) => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const getUserList = useUserStore((state) => state.user);
    const userState = useUserStore((state) => state.userState);

    useEffect(() => {
        getUserList();
    }
    , [getUserList]);  

    const handleUserClick = (userId: string): void => {
        const newSelectedUserId = userId === selectedUserId ? null : userId;
        setSelectedUserId(newSelectedUserId);

        if (onFilterChange) {
            onFilterChange(newSelectedUserId);
        }
    };

    return (
        <div className="flex items-center space-x-4">
        <span className="text-gray-600 font-medium">Filter by:</span>
        <div className="flex -space-x-2">
            {userState.type === 'Success' && (userState.data?.data || []).map((user, idx) => (
                <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className={`
                    h-8 w-8 rounded-full border-2 border-white 
                    flex items-center justify-center 
                    text-white text-xs font-bold 
                    cursor-pointer transition-transform duration-200 ease-in-out
                    hover:scale-110 hover:z-10
                    ${
                        bgColorSchema[idx % bgColorSchema.length]
                    }
                    ${selectedUserId === user.id ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
                    `}
                    title={user.name}
                >
                    {user.name.charAt(0).toUpperCase()}
                </div>
            ))}
        </div>
        {selectedUserId && (
            <button 
                onClick={() => handleUserClick(selectedUserId)}
                className="text-xs text-blue-600 hover:underline"
            >
                Clear filter
            </button>
        )}
        </div>
    );
};

export default UserFilter;