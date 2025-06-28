import { useState } from "react";

export function Tooltip({ children, content, position = "top" }) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full mb-2",
        right: "left-full ml-2",
        bottom: "top-full mt-2",
        left: "right-full mr-2",
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && (
                <div className={`absolute z-50 w-max max-w-xs px-3 py-2 text-sm text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200 ${positionClasses[position]}`}>
                    {content}
                    <div className={`absolute w-3 h-3 bg-white transform rotate-45 border border-gray-200 ${position === 'top' ? 'bottom-[-6px]' : ''} ${position === 'right' ? 'left-[-6px]' : ''} ${position === 'bottom' ? 'top-[-6px]' : ''} ${position === 'left' ? 'right-[-6px]' : ''}`} />
                </div>
            )}
        </div>
    );
}