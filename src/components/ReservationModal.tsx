'use client';

import React, { useState, FormEvent } from 'react';
import { createOrder } from '@/app/dashboard/actions';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  strain: {
    id: string;
    name: string;
    stock_grams: number;
  } | null;
  monthlyLimitRemaining: number;
}

export default function ReservationModal({ isOpen, onClose, strain, monthlyLimitRemaining }: ReservationModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !strain) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (quantity <= 0) {
      setError('Quantity must be a positive number.');
      setLoading(false);
      return;
    }
    if (quantity > 7) {
      setError('Quantity cannot exceed 7g per order.');
      setLoading(false);
      return;
    }
    if (quantity > monthlyLimitRemaining) {
      setError(`Quantity exceeds your remaining monthly allowance of ${monthlyLimitRemaining}g.`);
      setLoading(false);
      return;
    }
    if (quantity > strain.stock_grams) {
      setError(`Quantity exceeds available stock of ${strain.stock_grams}g.`);
      setLoading(false);
      return;
    }

    const result = await createOrder(strain.id, quantity);

    if (result.error) {
      setError(result.error);
    } else {
      setQuantity(1); // Reset quantity
      onClose(); // Close modal on success
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e1e1e] rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold gold-accent mb-4">Reserve {strain.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">Quantity (grams)</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              min="1"
              max={Math.min(7, monthlyLimitRemaining, strain.stock_grams)} // Dynamic max based on limits and stock
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-gold-accent focus:border-gold-accent"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">Max 7g per order, {monthlyLimitRemaining?.toFixed(2)}g monthly remaining, {strain.stock_grams}g in stock.</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#D4AF37] hover:bg-[#c0a030] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Reserving...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
