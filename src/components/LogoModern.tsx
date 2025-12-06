interface LogoModernProps {
  variant?: 'full' | 'icon';
  className?: string;
  size?: number;
}

export default function LogoModern({ variant = 'full', className = '', size = 48 }: LogoModernProps) {
  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#modernGradient)" />

        {/* Geometric flower/leaf pattern */}
        <g transform="translate(50, 50)">
          {/* Center hexagon */}
          <path
            d="M 0,-12 L 10,-6 L 10,6 L 0,12 L -10,6 L -10,-6 Z"
            fill="white"
            opacity="0.3"
          />

          {/* Petals/leaves */}
          <g opacity="0.9">
            {/* Top petal */}
            <path
              d="M 0,-12 Q 5,-20 0,-28 Q -5,-20 0,-12"
              fill="url(#accentGradient)"
            />
            {/* Top-right petal */}
            <path
              d="M 10,-6 Q 18,-10 24,-14 Q 16,-8 10,-6"
              fill="url(#accentGradient)"
              opacity="0.9"
            />
            {/* Bottom-right petal */}
            <path
              d="M 10,6 Q 18,10 24,14 Q 16,8 10,6"
              fill="url(#accentGradient)"
              opacity="0.8"
            />
            {/* Bottom petal */}
            <path
              d="M 0,12 Q 5,20 0,28 Q -5,20 0,12"
              fill="url(#accentGradient)"
              opacity="0.7"
            />
            {/* Bottom-left petal */}
            <path
              d="M -10,6 Q -18,10 -24,14 Q -16,8 -10,6"
              fill="url(#accentGradient)"
              opacity="0.8"
            />
            {/* Top-left petal */}
            <path
              d="M -10,-6 Q -18,-10 -24,-14 Q -16,-8 -10,-6"
              fill="url(#accentGradient)"
              opacity="0.9"
            />
          </g>

          {/* SF text */}
          <text
            x="0"
            y="6"
            fontSize="22"
            fontWeight="900"
            fill="white"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
          >
            SF
          </text>
        </g>
      </svg>
    );
  }

  // Full logo
  return (
    <svg
      width={size * 4.5}
      height={size}
      viewBox="0 0 450 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="modernFullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="accentFullGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id="textFullGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BBF7D0" />
        </linearGradient>
      </defs>

      {/* Icon */}
      <g transform="translate(50, 50)">
        <rect x="-45" y="-45" width="90" height="90" rx="20" fill="url(#modernFullGradient)" />
        
        <g>
          <path
            d="M 0,-12 L 10,-6 L 10,6 L 0,12 L -10,6 L -10,-6 Z"
            fill="white"
            opacity="0.3"
          />
          
          <g opacity="0.9">
            <path d="M 0,-12 Q 5,-20 0,-28 Q -5,-20 0,-12" fill="url(#accentFullGradient)" />
            <path d="M 10,-6 Q 18,-10 24,-14 Q 16,-8 10,-6" fill="url(#accentFullGradient)" opacity="0.9" />
            <path d="M 10,6 Q 18,10 24,14 Q 16,8 10,6" fill="url(#accentFullGradient)" opacity="0.8" />
            <path d="M 0,12 Q 5,20 0,28 Q -5,20 0,12" fill="url(#accentFullGradient)" opacity="0.7" />
            <path d="M -10,6 Q -18,10 -24,14 Q -16,8 -10,6" fill="url(#accentFullGradient)" opacity="0.8" />
            <path d="M -10,-6 Q -18,-10 -24,-14 Q -16,-8 -10,-6" fill="url(#accentFullGradient)" opacity="0.9" />
          </g>
        </g>
      </g>

      {/* Text */}
      <g transform="translate(120, 50)">
        <text
          x="0"
          y="8"
          fontSize="38"
          fontWeight="900"
          fill="white"
          fontFamily="Inter, sans-serif"
          letterSpacing="1"
          dominantBaseline="middle"
        >
          SOUTH FLOWERS
        </text>
        <text
          x="0"
          y="30"
          fontSize="12"
          fontWeight="700"
          fill="#E9D5FF"
          fontFamily="Inter, sans-serif"
          letterSpacing="3"
          dominantBaseline="middle"
        >
          C.H.R.A.
        </text>
      </g>
    </svg>
  );
}