import React from 'react';

// Config for the modern-minimal theme
export const modernMinimalConfig = {
  "id": "modern-minimal",
  "name": "Modern Minimal",
  "defaultContent": {
    "hero": {
      "names": "Emma & Ashley",
      "title": "We Are Getting Married",
      "date": "October 26th, 2025",
      "targetDate": "2025-10-26T15:00:00",
      "location": "Tuscany, Italy"
    },
    "story": [
      {
        "id": 1,
        "date": "Summer 2021",
        "title": "The First Meeting",
        "description": "We met at a coffee shop in downtown...",
        "image": "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800"
      },
      {
        "id": 2,
        "date": "Winter 2023",
        "title": "She Said Yes",
        "description": "Under the northern lights in Iceland...",
        "image": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800"
      }
    ],
    "logistics": {
      "ceremony": {
        "title": "The Ceremony",
        "time": "3:00 PM",
        "venue": "Castello di Vicarello",
        "address": "Via Vicarello, 1, 58044 Cinigiano GR"
      },
      "reception": {
        "title": "The Reception",
        "time": "5:30 PM",
        "venue": "The Olive Gardens",
        "address": "Same Venue - Garden Terrace"
      }
    },
    "rsvp": {
      "deadline": "September 1st",
      "couple_names": "Emma & Liam"
    }
  }
};

// The Modern Minimal Theme Component
export const ModernMinimalTheme = ({ content, weddingId, onContentChange }: any) => {
  return (
    <div className="w-full min-h-screen bg-white text-black font-sans">
      {/* Visible indicator that this is the modern theme */}
      <div className="border-4 border-red-500 p-4 bg-yellow-200 text-center">
        <h1 className="text-3xl font-bold text-red-600">MODERN THEME ACTIVE</h1>
      </div>
      
      {/* Hero Section */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">{content?.hero?.title || 'We Are Getting Married'}</h1>
        <p className="text-2xl mb-2">{content?.hero?.date || 'October 26th, 2025'}</p>
        {content?.hero?.names && (
          <p className="text-xl">{content.hero.names}</p>
        )}
        {content?.hero?.location && (
          <p className="text-lg mt-2">{content.hero.location}</p>
        )}
      </div>
    </div>
  );
};

// Export as default object matching the registry structure
export default {
  component: ModernMinimalTheme,
  config: modernMinimalConfig,
};

