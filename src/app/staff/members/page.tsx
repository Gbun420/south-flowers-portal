'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, FormEvent, useEffect } from 'react';
import { searchMembers, getMemberProfileAndOrders } from '@/app/staff/dashboard/actions';
import { format } from 'date-fns';
import Link from 'next/link'; // For messaging link

interface MemberSearchResult {
  id: string;
  full_name: string;
  email: string;
  residence_id_number: string;
}

interface MemberProfile {
  id: string;
  full_name: string;
  email: string;
  residence_id_number: string;
  membership_expiry: string;
  monthly_limit_remaining: number;
  created_at: string;
}

interface OrderHistoryItem {
  id: string;
  quantity_grams: number;
  status: string;
  created_at: string;
  strains: { name: string; type: string; thc_percent: number };
}

export default function StaffMembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MemberSearchResult[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberDetails, setMemberDetails] = useState<{ member: MemberProfile; history: OrderHistoryItem[] } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setSelectedMemberId(null);
    setMemberDetails(null);
    setSearchError(null);
    if (!searchTerm.trim()) {
      setSearchError('Please enter a name or ID number to search.');
      return;
    }
    const { members, error } = await searchMembers(searchTerm.trim());
    if (error) {
      setSearchError(error);
      setSearchResults([]);
    } else {
      setSearchResults(members || []);
      if (members && members.length === 0) {
        setSearchError('No members found matching your search.');
      }
    }
  };

  const fetchMemberDetails = async (memberId: string) => {
    setSelectedMemberId(memberId);
    setDetailsLoading(true);
    setMemberDetails(null);
    setSearchError(null);
    const { member, history, error } = await getMemberProfileAndOrders(memberId);
    if (error) {
      setSearchError(error);
    } else if (member && history) {
      setMemberDetails({ member, history });
    }
    setDetailsLoading(false);
  };

  useEffect(() => {
    if (selectedMemberId) {
      fetchMemberDetails(selectedMemberId);
    }
  }, [selectedMemberId]);


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Member Management</h1>

      <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Search by Name or ID Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400"
        />
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-4 rounded-md"
        >
          Search
        </button>
      </form>

      {searchError && <p className="text-red-500 mb-4">{searchError}</p>}

      {searchResults.length > 0 && !selectedMemberId && (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Search Results</h2>
          <ul className="divide-y divide-gray-700">
            {searchResults.map((member) => (
              <li key={member.id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{member.full_name}</p>
                  <p className="text-sm text-gray-400">{member.email} | ID: {member.residence_id_number}</p>
                </div>
                <button
                  onClick={() => fetchMemberDetails(member.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {detailsLoading && <div className="text-center py-8">Loading member details...</div>}

      {memberDetails && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-amber-400 mb-4">Member Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <p><strong>Name:</strong> {memberDetails.member.full_name}</p>
            <p><strong>Email:</strong> {memberDetails.member.email}</p>
            <p><strong>Residence ID:</strong> {memberDetails.member.residence_id_number}</p>
            <p><strong>Membership Expiry:</strong> {memberDetails.member.membership_expiry ? format(new Date(memberDetails.member.membership_expiry), 'MMM dd, yyyy') : 'N/A'}</p>
            <p><strong>Monthly Limit Remaining:</strong> {memberDetails.member.monthly_limit_remaining?.toFixed(2) || '0.00'}g</p>
            <p><strong>Member Since:</strong> {format(new Date(memberDetails.member.created_at), 'MMM dd, yyyy')}</p>
          </div>

          <div className="flex justify-end mb-6">
            <Link
              href={`/staff/messages/${memberDetails.member.id}`} // Link to staff-member chat
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Message Member
            </Link>
          </div>

          <h3 className="text-xl font-semibold mb-3">Order History (Last 5)</h3>
          {memberDetails.history.length === 0 ? (
            <p className="text-gray-400">No recent orders for this member.</p>
          ) : (
            <div className="overflow-x-auto bg-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Strain</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity (g)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                  {memberDetails.history.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.strains.name} ({order.strains.type})</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.quantity_grams}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{order.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
