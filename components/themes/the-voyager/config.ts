import { ThemeConfig } from '../../types/theme';

// Assets - files in public/ folder are served at root URL as strings
const bgImage = '/assets/vintage_map_desk_v1.jpg';
const passportCover = '/themes/the-voyager/blue_leather_texture.png';
const boardingPass = '/themes/the-voyager/boarding_pass_paper.png';
const walletTexture = '/themes/the-voyager/brown_wallet_v1.png';

export const theVoyagerConfig: ThemeConfig = {
    id: "4f9647d6-96b6-494b-97e3-512c01990422",
    name: "The Voyager",
    schema: [
        {
            section: 'hero',
            label: 'Passport Scene',
            fields: [
                { key: 'names', label: 'Couple Names', type: 'text', placeholder: 'Jack & Rose' },
                { key: 'date', label: 'Flight Date', type: 'text', placeholder: 'OCT 14, 1924' },
                { key: 'location', label: 'Destination', type: 'text', placeholder: 'LONDON - PARIS' },
                { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'BOARD FLIGHT' },
            ]
        },
        {
            section: 'adventure',
            label: 'Adventure Begins',
            fields: [
                { key: 'title', label: 'Title', type: 'textarea', placeholder: 'THE\nADVENTURE\nBEGINS' },
                { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Join us for our Wedding Celebration' },
                { key: 'saveTheDate', label: 'Save The Date Text', type: 'text', placeholder: 'Save the Date - 09.14.24' },
                { key: 'photo', label: 'Main Photo', type: 'image' },
                { key: 'photoQuote', label: 'Photo Quote', type: 'text', placeholder: '"The Beginning"' },
            ]
        },
        {
            section: 'story',
            label: 'Our Story',
            fields: [
                { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Our Story' },
                { key: 'photo1', label: 'Polaroid 1 (Back)', type: 'image' },
                { key: 'photo1Caption', label: 'Polaroid 1 Caption', type: 'text', placeholder: 'Paris, 2021' },
                { key: 'photo2', label: 'Polaroid 2 (Front)', type: 'image' },
                { key: 'photo2Caption', label: 'Polaroid 2 Caption', type: 'text', placeholder: '"She said yes!"' },
                { key: 'text', label: 'Story Text', type: 'textarea', placeholder: 'It all began...' },
            ]
        },
        {
            section: 'details',
            label: 'The Details',
            fields: [
                { key: 'title', label: 'Section Title', type: 'text', placeholder: 'The Details' },
                // Ceremony
                { key: 'ceremonyTitle', label: 'Ceremony Title', type: 'text', placeholder: 'Ceremony' },
                { key: 'ceremonyLocation', label: 'Ceremony Location', type: 'text', placeholder: 'The Old Cathedral' },
                { key: 'ceremonyAddress', label: 'Ceremony Address', type: 'text', placeholder: '123 Heritage Lane, Kyoto' },
                { key: 'ceremonyTime', label: 'Ceremony Time', type: 'text', placeholder: '14:00 PM' },
                { key: 'ceremonyMapLink', label: 'Ceremony Map Link', type: 'text', placeholder: 'https://maps.google.com...' },
                // Reception
                { key: 'receptionTitle', label: 'Reception Title', type: 'text', placeholder: 'Reception' },
                { key: 'receptionLocation', label: 'Reception Location', type: 'text', placeholder: 'Traditional Ryokan' },
                { key: 'receptionAddress', label: 'Reception Address', type: 'text', placeholder: 'Gion Ryokan, 456 Tea House Rd' },
                { key: 'receptionTime', label: 'Reception Time', type: 'text', placeholder: '18:00 PM' },
                { key: 'receptionMapLink', label: 'Reception Map Link', type: 'text', placeholder: 'https://maps.google.com...' },
                // Hotel
                { key: 'hotelTitle', label: 'Hotel Title', type: 'text', placeholder: 'Hotel' },
                { key: 'hotelLocation', label: 'Hotel Location', type: 'text', placeholder: 'Four Seasons' },
                { key: 'hotelAddress', label: 'Hotel Address', type: 'text', placeholder: '789 Higashiyama Ward' },
                { key: 'hotelNote', label: 'Hotel Note', type: 'text', placeholder: 'Code: LOVE24' },
                { key: 'hotelMapLink', label: 'Hotel Map Link', type: 'text', placeholder: 'https://maps.google.com...' },
            ]
        },
        {
            section: 'rsvp',
            label: 'RSVP',
            fields: [
                { key: 'title', label: 'Section Title', type: 'text', placeholder: 'RSVP' },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'We would be honored...' },
                { key: 'deadline', label: 'Deadline Text', type: 'text', placeholder: 'Kindly reply by June 1st' },
                { key: 'formTitle', label: 'Form Title', type: 'text', placeholder: 'Confirm Your Seat' },
            ]
        },
        {
            section: 'thankYou',
            label: 'Thank You',
            fields: [
                { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Thank You' },
                { key: 'message', label: 'Message', type: 'textarea', placeholder: 'The greatest journey...' },
                { key: 'signOff', label: 'Sign Off', type: 'text', placeholder: '- With Love, The Couple -' },
            ]
        }
    ],
    defaultContent: {
        hero: {
            names: "Alexander & Isabella",
            date: "APRIL 14, 2026",
            location: "LAKE COMO, ITALY",
            buttonText: "BOARD FLIGHT",
            bgImage: bgImage,
            passportCover: passportCover,
            boardingPass: boardingPass,
            walletTexture: walletTexture,
        },
        adventure: {
            title: "THE\nADVENTURE\nBEGINS",
            subtitle: "Join us for our Wedding Celebration",
            saveTheDate: "Save the Date - 09.14.24",
            photo: null, // Component will use fallback
            photoQuote: "\"The Beginning\"",
        },
        story: {
            title: "Our Story",
            photo1: null,
            photo1Caption: "Paris, 2021",
            photo2: null,
            photo2Caption: "\"She said yes!\"",
            text: "It all began with a shared love for vintage maps and coffee. What started as a chance encounter at a local cafe quickly turned into an adventure of a lifetime.\n\nFrom rainy days in London to sunny beaches in Bali, every moment has been a new discovery. We’ve traveled miles together, but our greatest journey is just beginning.",
        },
        details: {
            title: "The Details",
            ceremonyTitle: "Ceremony",
            ceremonyLocation: "The Old Cathedral",
            ceremonyAddress: "123 Heritage Lane, Kyoto",
            ceremonyTime: "14:00 PM",
            ceremonyMapLink: "https://www.google.com/maps/search/?api=1&query=The+Old+Cathedral+Kyoto",
            receptionTitle: "Reception",
            receptionLocation: "Traditional Ryokan",
            receptionAddress: "Gion Ryokan, 456 Tea House Rd",
            receptionTime: "18:00 PM",
            receptionMapLink: "https://www.google.com/maps/search/?api=1&query=Gion+Ryokan+Kyoto",
            hotelTitle: "Hotel",
            hotelLocation: "Four Seasons",
            hotelAddress: "789 Higashiyama Ward",
            hotelNote: "Code: LOVE24",
            hotelMapLink: "https://www.google.com/maps/search/?api=1&query=Four+Seasons+Kyoto",
        },
        rsvp: {
            title: "RSVP",
            description: "\"We would be honored to have you join us on this special day. Please let us know if you can make it.\"",
            deadline: "Kindly reply by June 1st",
            formTitle: "Confirm Your Seat",
        },
        thankYou: {
            title: "Thank You",
            message: "\"The greatest journey is the one that leads us home.\"",
            signOff: "- With Love, The Couple -",
        }
    }
};
