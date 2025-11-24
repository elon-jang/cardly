import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="toast-icon success" />,
        error: <AlertCircle size={20} className="toast-icon error" />,
        info: <Info size={20} className="toast-icon info" />
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                {icons[type]}
                <span className="toast-message">{message}</span>
            </div>
            <button onClick={onClose} className="toast-close">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
