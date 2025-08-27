export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
      <div className="text-center">
        {/* Logo/App Name */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">HomeBud</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Intelligentes Grow Management
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin">
              <div className="w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
            </div>
            
            {/* Inner dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-neutral-600 dark:text-neutral-400">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="mt-2 text-sm">Lade Anwendung</p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-48 mx-auto">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
