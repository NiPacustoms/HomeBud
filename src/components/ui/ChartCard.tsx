interface ChartData {
  time: string
  value: number
}

interface ChartCardProps {
  title: string
  subtitle?: string
  chartType: 'line' | 'bar' | 'pie'
  data: ChartData[]
  className?: string
}

export function ChartCard({ title, subtitle, chartType, data, className = '' }: ChartCardProps) {
  // Simple chart rendering - in a real app, you'd use a charting library like Chart.js
  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <div className="h-48 flex items-end justify-between space-x-1">
          {data.map((point, index) => {
            const maxValue = Math.max(...data.map(d => d.value))
            const height = (point.value / maxValue) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-primary rounded-t transition-all duration-300 hover:bg-primary-600"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {point.time}
                </span>
              </div>
            )
          })}
        </div>
      )
    }
    
    if (chartType === 'bar') {
      return (
        <div className="h-48 flex items-end justify-between space-x-2">
          {data.map((point, index) => {
            const maxValue = Math.max(...data.map(d => d.value))
            const height = (point.value / maxValue) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-secondary rounded-t transition-all duration-300 hover:bg-secondary-600"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {point.time}
                </span>
              </div>
            )
          })}
        </div>
      )
    }
    
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="text-neutral-500 dark:text-neutral-400">
          Chart type not implemented
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl ${className}`}>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-white/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {renderChart()}
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/70">Aktuell</span>
            </div>
          </div>
          <div className="text-white/50">
            {data.length} Datenpunkte
          </div>
        </div>
      </div>
    </div>
  )
}
