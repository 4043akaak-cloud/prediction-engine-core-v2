export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl text-center">
          {/* Project Name */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Prediction Engine Core
          </h1>

          {/* Tagline */}
          <div className="mb-8">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Predict Better.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
              Decide Better.
            </p>
          </div>

          {/* Mission Statement */}
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Prediction Engine Core is a tool to reduce uncertainty about the future.
          </p>

          {/* Input and Button */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ask anything about the future..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <button className="w-full px-6 py-4 text-lg font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              Predict
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
