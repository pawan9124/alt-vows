// The "Blueprint" for any Vintage Vinyl Theme (Rock, Jazz, etc.)
export const vintageVinylSchema = [
    // 1. THE COVER (Landing Page)
    {
        id: 'hero',
        label: 'The Cover (Hero)',
        fields: [
            { key: 'hero.title', label: 'Album Title', type: 'text', placeholder: 'A Night of Smooth Jazz' },
            { key: 'hero.names', label: 'Artist Names (Couple)', type: 'text', placeholder: 'Miles & Ella' },
            { key: 'hero.date', label: 'Release Date', type: 'text', placeholder: 'DEC 31, 2026' }
        ]
    },

    // 2. LINER NOTES (The "Story" or "Invite" Text)
    {
        id: 'liner-notes',
        label: 'Liner Notes (Story)',
        fields: [
            { key: 'story.title', label: 'Header', type: 'text', placeholder: 'Liner Notes' },
            { key: 'story.image', label: 'Story Image', type: 'image' },
            { key: 'hero.location', label: 'Studio Location', type: 'text', placeholder: 'The Blue Note Jazz Club' },
            { key: 'story.description', label: 'The Story', type: 'textarea', placeholder: 'It started with a chance encounter...' },
            { key: 'story.signOff', label: 'Sign Off', type: 'text', placeholder: 'With Love,' }
        ]
    },

    // 3. THE SETLIST (Logistics/Schedule)
    {
        id: 'setlist',
        label: 'The Setlist (Logistics)',
        fields: [
            { key: 'logistics.title', label: 'Section Title', type: 'text', placeholder: 'The Setlist' },

            // Ceremony
            { key: 'logistics.ceremony.time', label: 'Ceremony Time', type: 'text', placeholder: '4:00 PM' },
            { key: 'logistics.ceremony.venue', label: 'Ceremony Venue', type: 'text', placeholder: 'The Venue' },
            { key: 'logistics.ceremony.address', label: 'Ceremony Address', type: 'text', placeholder: '123 Love Lane' },

            // Reception
            { key: 'logistics.reception.time', label: 'Reception Time', type: 'text', placeholder: '6:00 PM' },
            { key: 'logistics.reception.venue', label: 'Reception Venue', type: 'text', placeholder: 'The Ballroom' },
            { key: 'logistics.reception.address', label: 'Reception Address', type: 'text', placeholder: '123 Love Lane' }
        ]
    },

    // 4. STUDIO SESSIONS (The Gallery)
    {
        id: 'studio-sessions',
        label: 'Studio Sessions (Gallery)',
        fields: [
            { key: 'gallery.title', label: 'Gallery Title', type: 'text', placeholder: 'Studio Sessions' },
            // "image-list" tells the editor to show a grid of uploaders (we will build this later)
            { key: 'gallery.images', label: 'Photos', type: 'image-list' }
        ]
    },

    // 5. VINYL AESTHETICS (The Look & Feel)
    {
        id: 'style',
        label: 'Vinyl Aesthetics',
        fields: [
            { key: 'theme.global.palette.primary', label: 'Primary Color', type: 'color' },
            { key: 'theme.pages.player.glowColor', label: 'Neon Glow Color', type: 'color' },
            { key: 'theme.pages.player.photoFrameStyle', label: 'Frame Style', type: 'select', options: ['minimal', 'tape', 'gold'] },
            // Advanced: Allow swapping the record texture!
            { key: 'theme.assets.recordTexture', label: 'Record Label', type: 'text' }
        ]
    }
];