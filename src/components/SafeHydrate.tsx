'use client';

import { useState, useEffect } from 'react';

interface SafeHydrateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SafeHydrate({ children, fallback = null }: SafeHydrateProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering fallback on server
  if (!isMounted) {
    return fallback || <div className="animate-pulse bg-gray-200 rounded">Loading...</div>;
  }

  return <>{children}</>;
}

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client side
  if (!isClient) {
    return fallback;
  }

  return <>{children}</>;
}

interface ServerOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ServerOnly({ children, fallback = null }: ServerOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on server side
  if (isClient) {
    return fallback;
  }

  return <>{children}</>;
}