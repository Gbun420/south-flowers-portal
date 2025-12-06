interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  size?: number;
}

export default function Logo({ variant = 'full', className = '', size = 48 }: LogoProps) {
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
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>

        {/* Circular background */}
        <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" opacity="0.1" />
        <circle cx="50" cy="50" r="48" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />

        {/* Stylized cannabis leaf */}
        <g transform="translate(50, 50)">
          {/* Center leaf */}
          <path
            d="M 0,-25 Q 3,-15 0,0 Q -3,-15 0,-25 Z"
            fill="url(#leafGradient)"
            opacity="0.9"
          />
          
          {/* Left leaves */}
          <path
            d="M -2,-20 Q -8,-15 -12,-8 Q -8,-12 -2,-15 Z"
            fill="url(#leafGradient)"
            opacity="0.8"
          />
          <path
            d="M -3,-15 Q -12,-10 -18,-2 Q -12,-8 -3,-10 Z"
            fill="url(#leafGradient)"
            opacity="0.7"
          />
          <path
            d="M -4,-10 Q -15,-5 -22,5 Q -15,-2 -4,-5 Z"
            fill="url(#leafGradient)"
            opacity="0.6"
          />

          {/* Right leaves */}
          <path
            d="M 2,-20 Q 8,-15 12,-8 Q 8,-12 2,-15 Z"
            fill="url(#leafGradient)"
            opacity="0.8"
          />
          <path
            d="M 3,-15 Q 12,-10 18,-2 Q 12,-8 3,-10 Z"
            fill="url(#leafGradient)"
            opacity="0.7"
          />
          <path
            d="M 4,-10 Q 15,-5 22,5 Q 15,-2 4,-5 Z"
            fill="url(#leafGradient)"
            opacity="0.6"
          />

          {/* Stem */}
          <path
            d="M -1,0 L -1,15 Q -1,18 0,18 Q 1,18 1,15 L 1,0 Z"
            fill="url(#leafGradient)"
            opacity="0.5"
          />

          {/* SF monogram overlay */}
          <text
            x="0"
            y="8"
            fontSize="26"
            fontWeight="900"
            fill="white"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
          >
            SF
          </text>
        </g>
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg
      width={size * 4}
      height={size}
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="fullLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="fullLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BBF7D0" />
        </linearGradient>
      </defs>

      {/* Icon part */}
      <g transform="translate(50, 50)">
        {/* Circular background */}
        <circle cx="0" cy="0" r="45" fill="url(#fullLogoGradient)" opacity="0.15" />
        <circle cx="0" cy="0" r="45" stroke="url(#fullLogoGradient)" strokeWidth="2" fill="none" />

        {/* Stylized cannabis leaf */}
        <g>
          {/* Center leaf */}
          <path
            d="M 0,-22 Q 3,-14 0,0 Q -3,-14 0,-22 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.9"
          />
          
          {/* Left leaves */}
          <path
            d="M -2,-18 Q -7,-14 -11,-8 Q -7,-11 -2,-14 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.8"
          />
          <path
            d="M -3,-14 Q -11,-9 -16,-2 Q -11,-7 -3,-9 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.7"
          />
          <path
            d="M -4,-9 Q -14,-4 -20,4 Q -14,-2 -4,-4 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.6"
          />

          {/* Right leaves */}
          <path
            d="M 2,-18 Q 7,-14 11,-8 Q 7,-11 2,-14 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.8"
          />
          <path
            d="M 3,-14 Q 11,-9 16,-2 Q 11,-7 3,-9 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.7"
          />
          <path
            d="M 4,-9 Q 14,-4 20,4 Q 14,-2 4,-4 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.6"
          />

          {/* Stem */}
          <path
            d="M -1,0 L -1,14 Q -1,16 0,16 Q 1,16 1,14 L 1,0 Z"
            fill="url(#fullLeafGradient)"
            opacity="0.5"
          />
        </g>
      </g>

      {/* Text */}
      <g transform="translate(120, 50)">
        <text
          x="0"
          y="8"
          fontSize="36"
          fontWeight="800"
          fill="white"
          fontFamily="Inter, sans-serif"
          letterSpacing="2"
          dominantBaseline="middle"
        >
          SOUTH FLOWERS
        </text>
        <text
          x="0"
          y="28"
          fontSize="12"
          fontWeight="600"
          fill="#BBF7D0"
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