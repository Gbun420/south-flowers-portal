'use client';

import { useState } from 'react';
import ReservationModal from './ReservationModal';

interface Strain {
  id: string;
  name: string;
  type: string;
  stock_grams: number;
  thc_percent: number;
  cbd_percent: number;
  price_per_gram: number;
}

interface StrainReservationProps {
  strain: Strain;
  monthlyLimitRemaining: number;
}

export default function StrainReservation({ strain, monthlyLimitRemaining }: StrainReservationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const maxQuantity = Math.min(strain.stock_grams, monthlyLimitRemaining, 28); // Max 28g per order

  const totalPrice = quantity * strain.price_per_gram;

  return (
    <>
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div>
          <label className="block text-primary-300 text-sm mb-2">Quantity (grams)</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-full bg-glass-border flex items-center justify-center text-white disabled:opacity-50"
            >
              -
            </button>
            <span className="text-white font-semibold text-lg">{quantity}g</span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
              className="w-10 h-10 rounded-full bg-glass-border flex items-center justify-center text-white disabled:opacity-50"
            >
              +
            </button>
          </div>
          <p className="text-xs text-primary-300 mt-2">
            Max: {maxQuantity}g (based on stock and your monthly limit)
          </p>
        </div>

        {/* Price Summary */}
        <div className="bg-glass-light rounded-lg p-4">
          <div className="flex justify-between text-primary-300">
            <span>{quantity}g × ${strain.price_per_gram}/g</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="border-t border-glass-border mt-2 pt-2 flex justify-between text-white font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Reserve Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={strain.stock_grams <= 0 || monthlyLimitRemaining <= 0}
          className="w-full rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 text-white font-medium py-4 px-6 transition-all duration-300 hover:from-primary-600 hover:to-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {strain.stock_grams <= 0 ? 'Out of Stock' : 
           monthlyLimitRemaining <= 0 ? 'Monthly Limit Reached' : 
           'Reserve for Pickup'}
        </button>
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        strain={strain}
        quantity={quantity}
        totalPrice={totalPrice}
      />
    </>
  );
}
