import StrainCardSkeleton from '@/components/StrainCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Modern Glass Navbar */}
      <nav className="relative backdrop-blur-xl bg-glass-bg border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-glass-heavy rounded-2xl animate-pulse" />
              <div>
                <div className="h-6 bg-glass-heavy rounded w-40 mb-2 animate-pulse" />
                <div className="h-4 bg-glass-heavy rounded w-32 animate-pulse" />
              </div>
            </div>
            <div className="h-10 bg-glass-heavy rounded-xl w-24 animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Hero Welcome Section Skeleton */}
        <div className="mb-10">
          <div className="relative backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-12 bg-glass-heavy rounded-lg w-3/4 animate-pulse" />
                <div className="h-6 bg-glass-heavy rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-glass-heavy rounded w-1/3 animate-pulse" />
              </div>
              
              <div className="w-80 h-48 bg-glass-heavy rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Strains Section Skeleton */}
        <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-glass-heavy rounded w-48 mb-2 animate-pulse" />
              <div className="h-4 bg-glass-heavy rounded w-64 animate-pulse" />
            </div>
            <div className="h-4 bg-glass-heavy rounded w-24 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StrainCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}