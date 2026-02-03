'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Guest {
  id: string;
  name: string;
  email: string | null;
  attending: boolean;
  plus_ones: number;
  message: string | null;
  created_at: string;
}

interface GuestListProps {
  weddingId: string;
}

export const GuestList: React.FC<GuestListProps> = ({ weddingId }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      if (!weddingId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('guests')
          .select('*')
          .eq('wedding_id', weddingId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setGuests(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching guests:', err);
        setError(err.message || 'Failed to load guests');
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [weddingId]);

  // Calculate totals
  const totalGuests = guests.length;
  const attendingCount = guests.filter((g) => g.attending).length;
  const notAttendingCount = guests.filter((g) => !g.attending).length;
  const totalPartySize = guests
    .filter((g) => g.attending)
    .reduce((sum, g) => sum + 1 + g.plus_ones, 0);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="font-serif text-cream text-lg animate-pulse">Loading guests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="font-serif text-red-400 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Section */}
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="font-serif text-2xl text-cream mb-4">RSVP Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-cream">{totalGuests}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
              Total Responses
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{attendingCount}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
              Attending
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{notAttendingCount}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
              Not Attending
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">{totalPartySize}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
              Total Guests
            </div>
          </div>
        </div>
      </div>

      {/* Guest List Table */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gold font-serif">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gold font-serif">
                  Email
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gold font-serif">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gold font-serif">
                  Party Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gold font-serif">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gold font-serif">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 font-serif">
                    No RSVPs yet
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-cream font-serif">{guest.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {guest.email || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${guest.attending
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                      >
                        {guest.attending ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-cream font-serif">
                      {guest.attending ? 1 + guest.plus_ones : 0}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">
                      {guest.message || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(guest.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

