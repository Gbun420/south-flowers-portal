import Logo from '@/components/Logo';
import LogoModern from '@/components/LogoModern';

export default function LogosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold text-white">South Flowers Logos</h1>
            <p className="text-primary-300 text-lg">Brand identity variations</p>
          </div>

          {/* Logo Variant 1 - Organic Leaf */}
          <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6">Organic Leaf Design</h2>
            
            <div className="space-y-8">
              {/* Full logo on dark */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Full Logo - Dark Background</p>
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 flex items-center justify-center">
                  <Logo variant="full" size={60} />
                </div>
              </div>

              {/* Full logo on light */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Full Logo - Light Background</p>
                <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                  <Logo variant="full" size={60} />
                </div>
              </div>

              {/* Icon variations */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Icon Variations</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 flex items-center justify-center">
                    <Logo variant="icon" size={64} />
                  </div>
                  <div className="bg-white rounded-2xl p-6 flex items-center justify-center">
                    <Logo variant="icon" size={64} />
                  </div>
                  <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 flex items-center justify-center">
                    <Logo variant="icon" size={80} />
                  </div>
                  <div className="bg-primary-100 rounded-2xl p-6 flex items-center justify-center">
                    <Logo variant="icon" size={80} />
                  </div>
                </div>
              </div>

              {/* Size variations */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Size Variations</p>
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 flex items-center justify-center gap-8 flex-wrap">
                  <Logo variant="icon" size={32} />
                  <Logo variant="icon" size={48} />
                  <Logo variant="icon" size={64} />
                  <Logo variant="icon" size={96} />
                  <Logo variant="icon" size={128} />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Variant 2 - Modern Geometric */}
          <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Modern Geometric Design</h2>
            
            <div className="space-y-8">
              {/* Full logo on dark */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Full Logo - Dark Background</p>
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 flex items-center justify-center">
                  <LogoModern variant="full" size={60} />
                </div>
              </div>

              {/* Full logo on light */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Full Logo - Light Background</p>
                <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                  <LogoModern variant="full" size={60} />
                </div>
              </div>

              {/* Icon variations */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Icon Variations</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 flex items-center justify-center">
                    <LogoModern variant="icon" size={64} />
                  </div>
                  <div className="bg-white rounded-2xl p-6 flex items-center justify-center">
                    <LogoModern variant="icon" size={64} />
                  </div>
                  <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 flex items-center justify-center">
                    <LogoModern variant="icon" size={80} />
                  </div>
                  <div className="bg-primary-100 rounded-2xl p-6 flex items-center justify-center">
                    <LogoModern variant="icon" size={80} />
                  </div>
                </div>
              </div>

              {/* Size variations */}
              <div className="space-y-3">
                <p className="text-sm text-primary-400 uppercase tracking-wider font-medium">Size Variations</p>
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 flex items-center justify-center gap-8 flex-wrap">
                  <LogoModern variant="icon" size={32} />
                  <LogoModern variant="icon" size={48} />
                  <LogoModern variant="icon" size={64} />
                  <LogoModern variant="icon" size={96} />
                  <LogoModern variant="icon" size={128} />
                </div>
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Usage Guidelines</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary-300">✅ Do</h3>
                <ul className="space-y-2 text-sm text-primary-200">
                  <li>• Use on dark or light backgrounds with proper contrast</li>
                  <li>• Maintain minimum clear space around logo</li>
                  <li>• Scale proportionally</li>
                  <li>• Use approved color variations</li>
                  <li>• Ensure readability at all sizes</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-semantic-error">❌ Don't</h3>
                <ul className="space-y-2 text-sm text-primary-200">
                  <li>• Distort or stretch the logo</li>
                  <li>• Change colors outside brand palette</li>
                  <li>• Add effects or shadows</li>
                  <li>• Rotate or flip the logo</li>
                  <li>• Place on busy backgrounds</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-glass-heavy rounded-xl border border-glass-border">
              <p className="text-sm text-primary-300">
                <strong className="text-white">Minimum Size:</strong> Icon should not be smaller than 32px. Full logo should not be smaller than 120px wide.
              </p>
            </div>
          </div>

          {/* Code Examples */}
          <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Code Examples</h2>
            
            <div className="space-y-4">
              <div className="bg-primary-900 rounded-xl p-4 font-mono text-sm">
                <p className="text-primary-400 mb-2">// Organic Leaf Logo</p>
                <p className="text-primary-200">{'import Logo from "@/components/Logo";'}</p>
                <p className="text-primary-200 mt-2">{'<Logo variant="icon" size={48} />'}</p>
                <p className="text-primary-200">{'<Logo variant="full" size={60} />'}</p>
              </div>

              <div className="bg-primary-900 rounded-xl p-4 font-mono text-sm">
                <p className="text-primary-400 mb-2">// Modern Geometric Logo</p>
                <p className="text-primary-200">{'import LogoModern from "@/components/LogoModern";'}</p>
                <p className="text-primary-200 mt-2">{'<LogoModern variant="icon" size={48} />'}</p>
                <p className="text-primary-200">{'<LogoModern variant="full" size={60} />'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}