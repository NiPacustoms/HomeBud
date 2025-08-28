import CannabisGrowthAnimation from '@/components/CannabisGrowthAnimation'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-green-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
          🌱 Cannabis Wachstums-Animation Test
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <CannabisGrowthAnimation />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg text-green-700">
            Die Animation sollte automatisch zwischen den Wachstumsphasen wechseln!
          </p>
        </div>
      </div>
    </div>
  )
}
