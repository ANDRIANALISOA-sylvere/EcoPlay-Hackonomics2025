export function ProgressBar({ value, colorFrom = "from-blue-400", colorTo = "to-blue-600", className = "" }) {
    return (
        <div className={`h-3 bg-gray-200 rounded-full overflow-hidden ${className}`}>
            <div
                className={`h-full bg-gradient-to-r ${colorFrom} ${colorTo} rounded-full transition-all duration-500`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}