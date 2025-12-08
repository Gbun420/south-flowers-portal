'use client';

import Link from 'next/link';
import { useState } from 'react';
import ReservationModal from './ReservationModal';

interface Strain {
  id: string;
  name: string;
  type: string;
  thc_percent: number;
  cbd_percent: number;
  stock_grams: number;
  description: string;
}

interface StrainCardProps {
  strain: Strain;
  monthlyLimitRemaining?: number;
}

export default function StrainCard({ strain, monthlyLimitRemaining = 50 }: StrainCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openReservationModal = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    // Optionally trigger a refresh or show a notification
    window.location.reload();
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-glass-border bg-glass-bg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-glass-heavy hover:bg-glass-heavy hover:shadow-2xl hover:shadow-primary-900/20">
      {/* Soft UI inner shadow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-glass-light to-transparent opacity-60" />
      
      <Link href={`/dashboard/strains/${strain.id}`} className="block">
        <div className="relative p-6 flex flex-col justify-between gap-4 min-h-[200px]">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white text-lg group-hover:text-primary-500 transition-colors">
                {strain.name}
              </h3>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-glass-heavy border border-glass-border px-3 py-1 text-xs font-medium text-primary-300 backdrop-blur-sm">
                  {strain.type}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-semantic-success" />
                  <span className="text-primary-200">THC {strain.thc_percent}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary-600" />
                  <span className="text-primary-200">CBD {strain.cbd_percent ?? 0}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${strain.stock_grams > 10 ? 'bg-semantic-success' : strain.stock_grams > 5 ? 'bg-semantic-warning' : 'bg-semantic-error'}`} />
                <span className="text-xs text-primary-300">
                  {strain.stock_grams > 10 ? 'In Stock' : strain.stock_grams > 5 ? 'Limited' : 'Very Low'} ({strain.stock_grams}g)
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
        
      <button
        className="w-full rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 text-white font-medium py-3 px-4 transition-all duration-300 hover:from-primary-600 hover:to-primary-500 hover:shadow-lg hover:shadow-primary-900/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        onClick={openReservationModal}
        disabled={strain.stock_grams <= 0}
      >
        {strain.stock_grams <= 0 ? 'Out of Stock' : 'Reserve for Pickup'}
      </button>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        strain={strain}
        monthlyLimitRemaining={monthlyLimitRemaining}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
