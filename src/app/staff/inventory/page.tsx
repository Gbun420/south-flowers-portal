'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, FormEvent } from 'react';
import { updateStrain, createStrain } from '@/app/staff/dashboard/actions'; // Import server actions
import { useRouter } from 'next/navigation';

interface Strain {
  id: string;
  name: string;
  type: 'indica' | 'sativa' | 'hybrid';
  thc_percent: number;
  cbd_percent: number;
  stock_grams: number;
  price_per_gram: number;
  is_visible: boolean;
}

interface CreateNewStrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStrainCreated: () => void;
}

function CreateNewStrainModal({ isOpen, onClose, onStrainCreated }: CreateNewStrainModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'indica' | 'sativa' | 'hybrid'>('hybrid');
  const [thcPercent, setThcPercent] = useState(0);
  const [cbdPercent, setCbdPercent] = useState(0);
  const [stockGrams, setStockGrams] = useState(0);
  const [pricePerGram, setPricePerGram] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createStrain(name, type, thcPercent, cbdPercent, stockGrams, pricePerGram);

    if (result.error) {
      setError(result.error);
    } else {
      onStrainCreated(); // Notify parent to re-fetch strains
      onClose(); // Close modal
      // Reset form
      setName('');
      setType('hybrid');
      setThcPercent(0);
      setCbdPercent(0);
      setStockGrams(0);
      setPricePerGram(0);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e1e1e] rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">Add New Strain</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as 'indica' | 'sativa' | 'hybrid')} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
              <option value="indica">Indica</option>
              <option value="sativa">Sativa</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="thc" className="block text-sm font-medium text-gray-300">THC %</label>
            <input type="number" id="thc" value={thcPercent} onChange={(e) => setThcPercent(parseFloat(e.target.value))} step="0.1" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
          <div>
            <label htmlFor="cbd" className="block text-sm font-medium text-gray-300">CBD %</label>
            <input type="number" id="cbd" value={cbdPercent} onChange={(e) => setCbdPercent(parseFloat(e.target.value))} step="0.1" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Stock (g)</label>
            <input type="number" id="stock" value={stockGrams} onChange={(e) => setStockGrams(parseFloat(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price per Gram</label>
            <input type="number" id="price" value={pricePerGram} onChange={(e) => setPricePerGram(parseFloat(e.target.value))} step="0.01" className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700" disabled={loading}>Cancel</button>
            <button type="submit" className="py-2 px-4 border border-transparent rounded-md bg-amber-400 text-black hover:bg-amber-500" disabled={loading}>
              {loading ? 'Adding...' : 'Add Strain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function StaffInventoryPage() {
  const supabase = createClient();
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStrains = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('strains')
      .select('*')
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Error fetching strains:', fetchError.message);
      setError('Failed to fetch strains.');
      setStrains([]);
    } else {
      setStrains(data as Strain[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStrains();

    // Set up real-time subscription for strains
    const channel = supabase
      .channel('strains_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'strains' },
        (payload) => {
          fetchStrains(); // Re-fetch all strains on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStrain = async (strainId: string, updates: Partial<Strain>) => {
    // Optimistic update
    setStrains(prevStrains =>
      prevStrains.map(s => (s.id === strainId ? { ...s, ...updates } : s))
    );

    const result = await updateStrain(strainId, updates);
    if (result.error) {
      alert(result.error);
      // Revert optimistic update if error
      fetchStrains();
    }
  };

  if (loading) return <div className="text-center py-8">Loading inventory...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-4 rounded-md mb-6"
      >
        Add New Strain
      </button>

      {strains.length === 0 ? (
        <p className="text-center text-gray-400">No strains in inventory.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">THC %</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">CBD %</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock (g)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price/g</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Visible</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {strains.map((strain) => (
                <tr key={strain.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{strain.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{strain.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="number"
                      value={strain.thc_percent}
                      onChange={(e) => handleUpdateStrain(strain.id, { thc_percent: parseFloat(e.target.value) })}
                      className="bg-gray-700 border border-gray-600 rounded-md w-20 px-2 py-1 text-xs"
                      step="0.1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{strain.cbd_percent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="number"
                      value={strain.stock_grams}
                      onChange={(e) => handleUpdateStrain(strain.id, { stock_grams: parseFloat(e.target.value) })}
                      className="bg-gray-700 border border-gray-600 rounded-md w-20 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="number"
                      value={strain.price_per_gram}
                      onChange={(e) => handleUpdateStrain(strain.id, { price_per_gram: parseFloat(e.target.value) })}
                      className="bg-gray-700 border border-gray-600 rounded-md w-20 px-2 py-1 text-xs"
                      step="0.01"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={strain.is_visible}
                      onChange={(e) => handleUpdateStrain(strain.id, { is_visible: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-amber-400 rounded focus:ring-amber-400"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {/* Updates happen on change, no explicit save button per row */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateNewStrainModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStrainCreated={fetchStrains}
      />
    </div>
  );
}
