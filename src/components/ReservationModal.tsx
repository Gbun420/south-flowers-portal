'use client';

import React, { useState, FormEvent } from 'react';
import { createOrder } from '@/app/dashboard/actions';
import { Dialog, DialogPanel, DialogTitle, Field, Label, Input } from '@headlessui/react';
import { X, Package, AlertCircle } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  strain: {
    id: string;
    name: string;
    type: string;
    stock_grams: number;
    thc_percent: number;
    cbd_percent: number;
    price_per_gram: number; // Added price_per_gram
  } | null;
  // monthlyLimitRemaining: number; // Removed as it's passed from StrainReservation
  quantity: number; // Now passed as prop
  totalPrice: number; // Now passed as prop
  onSuccess?: () => void;
}

export default function ReservationModal({ 
  isOpen, 
  onClose, 
  strain, 
  quantity, // Destructure quantity from props
  totalPrice, // Destructure totalPrice from props
  onSuccess 
}: ReservationModalProps) {
  // const [quantity, setQuantity] = useState<number>(1); // Removed, now a prop
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    // setQuantity(1); // Removed, as quantity is a prop
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!strain) {
      setError('No strain selected.');
      setLoading(false);
      return;
    }

    // All quantity and limit checks are now handled in StrainReservation component
    // We can assume quantity and totalPrice are valid here
    // monthlyLimitRemaining is no longer directly available here.

    const result = await createOrder(strain.id, quantity); // quantity is now a prop

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      onSuccess?.();
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  if (!strain) return null;

  // const maxQuantity = Math.min(7, monthlyLimitRemaining, strain.stock_grams); // Removed, as checks are in StrainReservation

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md backdrop-blur-xl bg-glass-bg rounded-3xl border border-glass-border shadow-2xl shadow-primary-900/20 animate-scale-in">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-glass-heavy border border-glass-border text-primary-300 hover:text-white hover:bg-glass-border transition-all duration-300"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            {!success ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-900/25">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-white">
                        Confirm Reservation
                      </DialogTitle>
                      <p className="text-sm text-primary-300">Review your order before pickup</p>
                    </div>
                  </div>

                  {/* Strain Info Card */}
                  <div className="backdrop-blur-sm bg-glass-heavy rounded-2xl p-4 border border-glass-border">
                    <h3 className="font-semibold text-white text-lg mb-2">{strain.name}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center rounded-full bg-glass-bg border border-glass-border px-3 py-1 text-xs font-medium text-primary-300">
                        {strain.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-semantic-success" />
                        <span className="text-primary-200">THC {strain.thc_percent}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary-600" />
                        <span className="text-primary-200">CBD {strain.cbd_percent ?? 0}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-glass-border">
                      <span className="text-primary-300 text-sm">Quantity:</span>
                      <span className="text-white font-medium">{quantity}g</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-primary-300 text-sm">Price per gram:</span>
                      <span className="text-white font-medium">${strain.price_per_gram.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-glass-border font-bold text-white text-lg">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quantity input removed, as quantity is now a prop and review is shown above */}
                  {error && (
                    <div className="backdrop-blur-sm bg-semantic-error/10 border border-semantic-error/20 rounded-xl p-3 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-semantic-error flex-shrink-0 mt-0.5" />
                      <p className="text-semantic-error text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 backdrop-blur-sm bg-glass-heavy border border-glass-border text-primary-300 hover:text-white hover:bg-glass-border font-medium uppercase tracking-wider py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 font-bold uppercase tracking-wider py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40"
                      disabled={loading || quantity <= 0} // Check quantity validity here
                    >
                      {loading ? 'Processing...' : 'Confirm Reservation'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8 animate-fade-in">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-semantic-success/20 rounded-full animate-pulse-slow" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-semantic-success to-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-semantic-success/25">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Reservation Confirmed!</h3>
                <p className="text-primary-300 mb-1">
                  {quantity}g of {strain.name} reserved
                </p>
                <p className="text-sm text-primary-400">
                  You&apos;ll be notified when ready for pickup
                </p>
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}