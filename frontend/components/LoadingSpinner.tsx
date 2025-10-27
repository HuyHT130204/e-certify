import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'purple' | 'green' | 'gray'
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-12 h-12'
      case 'md':
      default:
        return 'w-8 h-8'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'purple':
        return 'border-purple-600'
      case 'green':
        return 'border-green-600'
      case 'gray':
        return 'border-gray-600'
      case 'blue':
      default:
        return 'border-blue-600'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-2 ${getSizeClasses()} ${getColorClasses()}`}></div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Loading...'
}) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

export default LoadingSpinner

