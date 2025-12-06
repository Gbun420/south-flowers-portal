import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-md w-full backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">SF</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <p className="text-primary-300 text-sm mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-300 font-medium text-center"
          >
            Return to Home
          </Link>
          
          <Link
            href="/login"
            className="block w-full bg-glass-heavy text-white border border-glass-border px-6 py-3 rounded-xl hover:border-glass-heavy hover:bg-glass-heavy transition-all duration-300 font-medium text-center"
          >
            Member Portal
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-glass-border">
          <p className="text-xs text-primary-400">
            South Flowers C.H.R.A. - Cannabis Harm Reduction Association
          </p>
        </div>
      </div>
    </div>
  );
}
