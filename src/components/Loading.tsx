type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'fullscreen'
type LoadingSize = 'sm' | 'md' | 'lg'
interface LoadingProps {
    /**
     * The visual style of the loading indicator
     * @default 'spinner'
     */
    variant?: LoadingVariant
    /**
     * The size of the loading indicator
     * @default 'md'
     */
    size?: LoadingSize
    /**
     * Optional text to display alongside the loading indicator
     */
    text?: string
    /**
     * Whether to show a semi-transparent overlay (only applies to fullscreen variant)
     * @default true
     */
    overlay?: boolean
    /**
     * Additional CSS classes to apply to the component
     */
    className?: string
}
export function Loading({
    variant = 'fullscreen',
    size = 'lg',
    text,
    overlay = true,
    className = '',
}: LoadingProps) {
    // Size mappings for the spinner
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    }
    // Text size mappings
    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }
    // Render spinner loading indicator
    const renderSpinner = () => (
        <div
            className={`${sizeClasses[size]} rounded-full border-gray-300 border-t-blue-600 animate-spin`}
        ></div>
    )
    // Render dots loading indicator
    const renderDots = () => (
        <div className="flex space-x-1">
            <div
                className={`${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'} bg-blue-600 rounded-full animate-bounce`}
                style={{
                    animationDelay: '0ms',
                }}
            ></div>
            <div
                className={`${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'} bg-blue-600 rounded-full animate-bounce`}
                style={{
                    animationDelay: '150ms',
                }}
            ></div>
            <div
                className={`${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'} bg-blue-600 rounded-full animate-bounce`}
                style={{
                    animationDelay: '300ms',
                }}
            ></div>
        </div>
    )
    // Render pulse loading indicator
    const renderPulse = () => (
        <div
            className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10'} relative`}
        >
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 bg-blue-600 rounded-full opacity-90 flex items-center justify-center">
                {size !== 'sm' && (
                    <div
                        className={`${size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} border-2 border-white border-t-transparent rounded-full animate-spin`}
                    ></div>
                )}
            </div>
        </div>
    )
    // Render the appropriate loading indicator based on the variant
    const renderLoadingIndicator = () => {
        switch (variant) {
            case 'dots':
                return renderDots()
            case 'pulse':
                return renderPulse()
            case 'spinner':
            default:
                return renderSpinner()
        }
    }
    // For fullscreen variant, render a centered loading indicator with optional overlay
    if (variant === 'fullscreen') {
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center ${overlay ? 'bg-gray-900/50' : ''} ${className}`}
            >
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
                    {renderSpinner()}
                    <span
                        className={`${textSizeClasses[size]} font-medium text-gray-700`}
                    >
                        {text || 'Cargando...'}
                    </span>
                </div>
            </div>
        )
    }
    // For inline variants, render the indicator with optional text
    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            {renderLoadingIndicator()}
            {text && (
                <span className={`${textSizeClasses[size]} text-gray-700`}>{text}</span>
            )}
        </div>
    )
}
