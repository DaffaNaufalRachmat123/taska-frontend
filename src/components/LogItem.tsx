// src/components/LogItem.tsx

import React from 'react';
import { Log } from '../interfaces/log-interface'; // Adjust path as needed

// A helper function to format dates into relative time (e.g., "2 hours ago")
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
        const days = Math.round(hours / 24);
    return `${days}d ago`;
};

// A helper to generate the log message
const generateLogMessage = (log: Log): React.ReactNode => {
    const { action, content, type } = log;
    const creator = <strong className="font-medium text-gray-800">{content.creator_name}</strong>;

    switch (type) {
        case 'task':
            return (
                <>
                    {creator} {action === 'create' ? 'created' : 'updated'} task.
                </>
            );
        case 'sprint':
            return (
                <>
                    {creator} {action === 'create' ? 'created' : 'updated'} sprint.
                </>
            );
        default:
            return <>{creator} performed an action.</>;
    }
};

export const LogItem: React.FC<{ log: Log }> = ({ log }) => {
    const colors = ['bg-red-100 text-red-700', 'bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-purple-100 text-purple-700'];
    const color = colors[log.content.creator_name.charCodeAt(0) % colors.length];

    return (
        <div className="flex space-x-3">
        {/* Avatar */}
        <div className={`mt-1 w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${color}`}>
            {log.content.creator_name.charAt(0).toUpperCase()}
        </div>
        {/* Log Content */}
        <div className="flex-grow text-sm">
            <p className="text-gray-600">{generateLogMessage(log)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(log.date)}</p>
        </div>
        </div>
    );
};

export default LogItem;