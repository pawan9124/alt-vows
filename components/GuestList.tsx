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
  const totalResponses = guests.length;
  const attendingCount = guests.filter((g) => g.attending).length;
  const notAttendingCount = guests.filter((g) => !g.attending).length;
  const totalPartySize = guests
    .filter((g) => g.attending)
    .reduce((sum, g) => sum + 1 + g.plus_ones, 0);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
        <h3
          className="text-lg font-semibold text-[var(--text-primary)] mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          RSVP Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{totalResponses}</div>
            <div
              className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Total Responses
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">{attendingCount}</div>
            <div
              className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Attending
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{notAttendingCount}</div>
            <div
              className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Not Attending
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--gold)]">{totalPartySize}</div>
            <div
              className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Total Guests
            </div>
          </div>
        </div>
      </div>

      {/* Guest List Table */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-deep)]">
              <tr>
                <th
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  Name
                </th>
                <th
                  className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  Party Size
                </th>
                <th
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  Message / Dietary
                </th>
                <th
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                    No RSVPs yet. Share your site link to start collecting responses!
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="px-4 py-3 text-[var(--text-primary)] font-medium">
                      {guest.name || '(no name)'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${guest.attending
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-red-500/15 text-red-400 border border-red-500/25'
                          }`}
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {guest.attending ? 'Attending' : 'Declined'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-primary)]">
                      {guest.attending ? 1 + guest.plus_ones : '—'}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] text-sm max-w-xs">
                      {guest.message || '—'}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-tertiary)] text-xs whitespace-nowrap">
                      {new Date(guest.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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
