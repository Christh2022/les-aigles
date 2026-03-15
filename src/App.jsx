import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          Les Aigles
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Association France-Congo pour l'aide sociale internationale
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <span className="badge-france">France</span>
          <span className="badge-congo">Congo</span>
        </div>
        <div className="card p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Plateforme de gestion pour l'association Les Aigles
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
