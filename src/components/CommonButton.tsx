import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'danger';
    label: string;
}

export default function CommonButton({
                                         variant = 'default',
                                         label,
                                         className = '',
                                         onClick,
                                         ...props
                                     }: Props) {

    const baseStyle = "!inline-flex !items-center !justify-center !px-4 !py-1.5 !rounded-sm !text-[13px] !font-medium !transition-colors !cursor-pointer !select-none disabled:!opacity-40 disabled:!cursor-not-allowed";

    const variantStyles = {
        default: '!bg-white !border !border-gray-300 !text-gray-600 hover:!bg-gray-50 active:!bg-gray-100',
        primary: '!bg-[#9CA3AF] !border !border-[#9CA3AF] !text-white hover:!bg-[#8b939f] active:!bg-[#7f8691]',
        danger: '!bg-white !border !border-red-300 !text-red-500 hover:!bg-red-50 active:!bg-red-100',
    };

    return (
        <button
            {...props}
            type={props.type || "button"}
            onClick={onClick}
            className={`${baseStyle} ${variantStyles[variant]} ${className}`}
        >
            <span className="!pointer-events-none">{label}</span>
        </button>
    );
}