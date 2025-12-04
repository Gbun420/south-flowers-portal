'use client';

import { cn } from '@/utils/classNames';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Logo({ size = 'medium', className = '' }: LogoProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16'
  };

  return (
    <div className={cn(sizeClasses[size], 'relative', className)}>
      {/* Main Logo Symbol - AI Brain + Mediterranean Sun */}
      <div className={cn(
        'absolute inset-0',
        'bg-gradient-to-br from-blue-600 to-purple-600',
        'rounded-full flex items-center justify-center shadow-lg'
      )}>
        
        {/* AI Circuit Pattern */}
        <div className="absolute w-6 h-6">
          <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
          
          {/* Connecting Lines */}
          <div className="absolute top-1 left-1 w-4 h-0.5 bg-white rotate-45"></div>
          <div className="absolute top-1 right-1 w-4 h-0.5 bg-white -rotate-45"></div>
          <div className="absolute bottom-1 left-1 w-4 h-0.5 bg-white -rotate-45"></div>
          <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-white rotate-45"></div>
        </div>
        
        {/* Sun Rays */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-3 bg-gradient-to-t from-yellow-300 to-transparent rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-12px)`,
                animationDelay: `${i * 100}ms`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface BrandNameProps {
  showTagline?: boolean;
  className?: string;
}

export function BrandName({ showTagline = false, className = '' }: BrandNameProps) {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Logo size="medium" />
      <div>
        <h1 className={cn(
          'text-2xl font-bold',
          'bg-gradient-to-r from-blue-600 to-purple-600',
          'bg-clip-text text-transparent'
        )}>
          MaltaIntelliNews
        </h1>
        {showTagline && (
          <p className="text-sm text-gray-600">AI-Powered News Insights</p>
        )}
      </div>
    </div>
  );
}

export function LogoOnly({ size = 'medium', className = '' }: LogoProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16'
  };

  return (
    <div className={cn(sizeClasses[size], 'relative', className)}>
      <div className={cn(
        'absolute inset-0',
        'bg-gradient-to-br from-blue-600 to-purple-600',
        'rounded-full flex items-center justify-center'
      )}>
        <div className="text-white font-bold text-xs">
          MIN
        </div>
      </div>
    </div>
  );
}