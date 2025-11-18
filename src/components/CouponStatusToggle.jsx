import React from 'react';
const CouponStatusToggle = ({ isActive, onToggle, disabled = false }) => {
    return (
        <button
            onClick={onToggle}
            disabled={disabled}
            className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                ${isActive ? 'bg-primary' : 'bg-gray-300'}
            `}
        >
            <span
                aria-hidden="true"
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${isActive ? 'translate-x-5' : 'translate-x-0'}
                `}
            />
        </button>
    );
};

export default CouponStatusToggle;