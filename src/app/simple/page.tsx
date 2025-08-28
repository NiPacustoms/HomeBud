import CannabisGrowthAnimation from '@/components/CannabisGrowthAnimation'

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-green-200 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
          🌱 Cannabis Wachstums-Animation
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <CannabisGrowthAnimation />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg text-green-700 mb-4">
            Die Animation wechselt automatisch zwischen den Wachstumsphasen!
          </p>
          <div className="text-sm text-green-600">
            <p>🌱 Samen → 🌿 Keimling → 🍃 Vegetative Phase → 🌸 Blüte → 🌳 Reife Pflanze</p>
          </div>
        </div>
      </div>
    </div>
  )
}
