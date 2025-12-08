import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import StrainReservation from '@/components/StrainReservation';
import { User } from '@supabase/supabase-js'; // Import User type

interface StrainDetailPageProps {
  params: {
    id: string;
  };
}

// Define the Strain interface with all expected properties
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
  effects: string[]; // Added effects property
}

export default async function StrainDetailPage({ params }: StrainDetailPageProps) {
  const supabase = await createClient();

  // Fetch strain details
  const { data: strain, error: strainError } = await supabase
    .from('strains')
    .select('*')
    .eq('id', params.id)
    .single();

  if (strainError || !strain) {
    notFound();
  }

  // Fetch user profile for monthly limit
  // Ensure user is authenticated to fetch profile
  const { data: { user } } = await supabase.auth.getUser();
  let monthlyLimitRemaining = 50; // Default if not found or unauthenticated

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('monthly_limit_remaining')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile for monthly limit:', profileError.message);
    } else if (profile) {
      monthlyLimitRemaining = profile.monthly_limit_remaining;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strain Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{strain.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center rounded-full bg-glass-heavy border border-glass-border px-3 py-1 text-sm font-medium text-primary-300">
                {strain.type}
              </span>
              <span className={`inline-flex items-center text-sm ${
                strain.stock_grams > 10 ? 'text-semantic-success' : 
                strain.stock_grams > 5 ? 'text-semantic-warning' : 'text-semantic-error'
              }`}>
                ● {strain.stock_grams > 10 ? 'In Stock' : strain.stock_grams > 5 ? 'Limited' : 'Very Low'} 
                ({strain.stock_grams}g)
              </span>
            </div>
          </div>

          {/* Strain Details */}
          <div className="bg-glass-heavy rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Strain Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-primary-300">THC Content:</span>
                <span className="text-white ml-2">{strain.thc_percent}%</span>
              </div>
              <div>
                <span className="text-primary-300">CBD Content:</span>
                <span className="text-white ml-2">{strain.cbd_percent || 0}%</span>
              </div>
              <div>
                <span className="text-primary-300">Price per Gram:</span>
                <span className="text-white ml-2">${strain.price_per_gram}</span>
              </div>
              <div>
                <span className="text-primary-300">Available Stock:</span>
                <span className="text-white ml-2">{strain.stock_grams}g</span>
              </div>
            </div>

            {strain.description && (
              <div className="mt-4">
                <span className="text-primary-300">Description:</span>
                <p className="text-white mt-1">{strain.description}</p>
              </div>
            )}
          </div>

          {/* Effects & Attributes */}
          <div className="bg-glass-heavy rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Attributes</h2>
            <div className="flex flex-wrap gap-2">
              {/* Ensure strain.effects is an array before mapping */}
              {Array.isArray(strain.effects) && strain.effects.map((effect: string, index: number) => (
                <span key={index} className="inline-flex items-center rounded-full bg-primary-900/50 px-3 py-1 text-xs text-primary-200">
                  {effect}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reservation Section */}
        <div className="lg:col-span-1">
          <div className="bg-glass-heavy rounded-2xl p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-white mb-4">Reserve for Pickup</h2>
            
            <StrainReservation 
              strain={strain}
              monthlyLimitRemaining={monthlyLimitRemaining}
            />

            {/* Quick Info */}
            <div className="mt-6 p-4 bg-glass-light rounded-lg">
              <h3 className="font-semibold text-white mb-2">Pickup Information</h3>
              <ul className="text-sm text-primary-300 space-y-1">
                <li>• Orders ready within 2 hours</li>
                <li>• Bring valid ID for pickup</li>
                <li>• Payment upon pickup</li>
                <li>• Store hours: Mon-Fri 10am-8pm, Sat 10am-1pm</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}