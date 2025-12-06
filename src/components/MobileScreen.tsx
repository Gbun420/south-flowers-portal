import React from 'react';

interface MobileScreenProps {
  children?: React.ReactNode;
}

export default function MobileScreen({ children }: MobileScreenProps) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#1A0033] to-[#4D0099] overflow-hidden">
      {children}
    </div>
  );
}