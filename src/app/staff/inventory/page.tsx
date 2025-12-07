'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, FormEvent } from 'react';
import { updateStrain, createStrain, deleteStrain } from '@/app/staff/dashboard/actions';
import { useRouter } from 'next/navigation';
import { Dialog, DialogPanel, DialogTitle, Field, Label, Input, Textarea, Select } from '@headlessui/react';
import { X, Plus, Edit2, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface Strain {
  id: string;
  name: string;
  type: 'indica' | 'sativa' | 'hybrid';
  thc_percent: number;
  cbd_percent: number;
  stock_grams: number;
  price_per_gram: number;
  is_visible: boolean;
  image_url?: string;
  description?: string;
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
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Simple preview using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createStrain(name, type, thcPercent, cbdPercent, stockGrams, pricePerGram, description, imageUrl);

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
      setDescription('');
      setImageUrl('');
      setImageFile(null);
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-glass-bg rounded-3xl border border-glass-border shadow-2xl shadow-primary-900/20">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-glass-heavy border border-glass-border text-primary-300 hover:text-white hover:bg-glass-border transition-all duration-300 z-10"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-900/25">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">Add New Strain</DialogTitle>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Name</Label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
              </Field>

              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Type</Label>
                <Select value={type} onChange={(e) => setType(e.target.value as 'indica' | 'sativa' | 'hybrid')} className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading}>
                  <option value="indica">Indica</option>
                  <option value="sativa">Sativa</option>
                  <option value="hybrid">Hybrid</option>
                </Select>
              </Field>

              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" disabled={loading} />
              </Field>

              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Bud Picture</Label>
                <div className="relative">
                  <input type="file" id="image" accept="image/*" onChange={handleImageUpload} className="block w-full glass-input text-white px-4 py-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-500 file:transition-colors" disabled={loading} />
                  {imageUrl && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-glass-border">
                      <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">THC %</Label>
                  <Input type="number" value={thcPercent} onChange={(e) => setThcPercent(parseFloat(e.target.value))} step="0.1" className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">CBD %</Label>
                  <Input type="number" value={cbdPercent} onChange={(e) => setCbdPercent(parseFloat(e.target.value))} step="0.1" className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Stock (g)</Label>
                  <Input type="number" value={stockGrams} onChange={(e) => setStockGrams(parseFloat(e.target.value))} className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Price/g (€)</Label>
                  <Input type="number" value={pricePerGram} onChange={(e) => setPricePerGram(parseFloat(e.target.value))} step="0.01" className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
              </div>

              {error && (
                <div className="backdrop-blur-sm bg-semantic-error/10 border border-semantic-error/20 rounded-xl p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-semantic-error flex-shrink-0 mt-0.5" />
                  <p className="text-semantic-error text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 backdrop-blur-sm bg-glass-heavy border border-glass-border text-primary-300 hover:text-white hover:bg-glass-border font-medium uppercase tracking-wider py-3 rounded-xl transition-all duration-300" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary-900/25" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Strain'}
                </button>
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

interface EditStrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  strain: Strain | null;
  onStrainUpdated: () => void;
}

function EditStrainModal({ isOpen, onClose, strain, onStrainUpdated }: EditStrainModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'indica' | 'sativa' | 'hybrid'>('hybrid');
  const [thcPercent, setThcPercent] = useState(0);
  const [cbdPercent, setCbdPercent] = useState(0);
  const [stockGrams, setStockGrams] = useState(0);
  const [pricePerGram, setPricePerGram] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (strain) {
      setName(strain.name);
      setType(strain.type);
      setThcPercent(strain.thc_percent);
      setCbdPercent(strain.cbd_percent);
      setStockGrams(strain.stock_grams);
      setPricePerGram(strain.price_per_gram);
      setDescription(strain.description || '');
      setImageUrl(strain.image_url || '');
    }
  }, [strain]);

  if (!isOpen || !strain) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await updateStrain(strain.id, {
      name,
      type,
      thc_percent: thcPercent,
      cbd_percent: cbdPercent,
      stock_grams: stockGrams,
      price_per_gram: pricePerGram,
      description,
      image_url: imageUrl
    });

    if (result.error) {
      setError(result.error);
    } else {
      onStrainUpdated();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-glass-bg rounded-3xl border border-glass-border shadow-2xl shadow-primary-900/20">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-glass-heavy border border-glass-border text-primary-300 hover:text-white hover:bg-glass-border transition-all duration-300 z-10"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-900/25">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">Edit Strain</DialogTitle>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Name</Label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
              </Field>

              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Type</Label>
                <Select value={type} onChange={(e) => setType(e.target.value as 'indica' | 'sativa' | 'hybrid')} className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading}>
                  <option value="indica">Indica</option>
                  <option value="sativa">Sativa</option>
                  <option value="hybrid">Hybrid</option>
                </Select>
              </Field>

              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" disabled={loading} />
              </Field>

              <Field>
                <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Bud Picture</Label>
                <div className="relative">
                  <input type="file" id="image" accept="image/*" onChange={handleImageUpload} className="block w-full glass-input text-white px-4 py-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-500 file:transition-colors" disabled={loading} />
                  {imageUrl && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-glass-border">
                      <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">THC %</Label>
                  <Input type="number" value={thcPercent} onChange={(e) => setThcPercent(parseFloat(e.target.value))} step="0.1" className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">CBD %</Label>
                  <Input type="number" value={cbdPercent} onChange={(e) => setCbdPercent(parseFloat(e.target.value))} step="0.1" className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Stock (g)</Label>
                  <Input type="number" value={stockGrams} onChange={(e) => setStockGrams(parseFloat(e.target.value))} className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
                <Field>
                  <Label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Price/g (€)</Label>
                  <Input type="number" value={pricePerGram} onChange={(e) => setPricePerGram(parseFloat(e.target.value))} step="0.01" className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={loading} />
                </Field>
              </div>

              {error && (
                <div className="backdrop-blur-sm bg-semantic-error/10 border border-semantic-error/20 rounded-xl p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-semantic-error flex-shrink-0 mt-0.5" />
                  <p className="text-semantic-error text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 backdrop-blur-sm bg-glass-heavy border border-glass-border text-primary-300 hover:text-white hover:bg-glass-border font-medium uppercase tracking-wider py-3 rounded-xl transition-all duration-300" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary-900/25" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Strain'}
                </button>
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default function StaffInventoryPage() {
  const supabase = createClient();
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStrain, setEditingStrain] = useState<Strain | null>(null);

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

  const handleDeleteStrain = async (strainId: string) => {
    if (confirm('Are you sure you want to delete this strain? This action cannot be undone.')) {
      const result = await deleteStrain(strainId);
      if (result.error) {
        alert(result.error);
      } else {
        fetchStrains();
      }
    }
  };

  const openEditModal = (strain: Strain) => {
    setEditingStrain(strain);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStrain(null);
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {strain.image_url ? (
                      <img src={strain.image_url} alt={strain.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </td>
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(strain)}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStrain(strain.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </div>
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

      <EditStrainModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        strain={editingStrain}
        onStrainUpdated={fetchStrains}
      />
    </div>
  );
}
