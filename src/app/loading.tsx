export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg animate-pulse" />
          <div className="relative w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/25">
            <span className="text-white font-bold text-2xl">SF</span>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        
        {/* Loading text */}
        <p className="text-primary-300 text-sm tracking-widest uppercase animate-pulse">
          Loading South Flowers...
        </p>
      </div>
    </div>
  );
}
