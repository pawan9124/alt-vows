export interface VinylThemeConfig {
  hero: {
    names: string;
    title: string;
    date: string;
    location: string;
  };
  style: {
    primaryColor: string;
    fontFamily: string;
    recordTexture: string;
    audioTrack: string;
    backgroundTexture?: string;
  };
  story: {
    title: string;
    description: string;
    image: string;
  };
  logistics: {
    title: string;
    ceremony: {
      time: string;
      venue: string;
      address: string;
    };
    reception: {
      time: string;
      venue: string;
      address: string;
    };
  };
  gallery: {
    title: string;
    images: string[];
  };
  rsvp: {
    ticketTitle: string;
    deadline: string;
    confirmationMessage: string;
  };
}

export const defaultContent: VinylThemeConfig = {
  hero: {
    names: "Alex & Sam",
    title: "Side A: The Beginning",
    date: "OCT 31, 2026",
    location: "The Velvet Underground"
  },
  style: {
    primaryColor: "#000000",      // Default: Black
    fontFamily: "Inter",          // Default: Clean font
    recordTexture: "/themes/vintage-vinyl/record.png",
    audioTrack: "/themes/vintage-vinyl/music.mp3",
    backgroundTexture: ""
  },
  story: {
    title: "Liner Notes",
    description: "It started with a chance encounter at a dusty record shop in the East Village, bonding over an obscure jazz press. Five years, countless concerts, and one unforgettable proposal later, we are finally ready to drop our debut album as a married couple. This isn't just a wedding; it's the headline show of our lives, and we can't wait to share the rhythm with you.",
    image: "https://cdn.pixabay.com/photo/2016/06/29/08/41/wedding-dresses-1486256_1280.jpg"
  },
  logistics: {
    title: "The Setlist",
    ceremony: {
      time: "4:00 PM",
      venue: "The Wythe Hotel",
      address: "80 Wythe Ave, Brooklyn, NY 11249"
    },
    reception: {
      time: "6:00 PM until Late",
      venue: "The Rooftop Garden",
      address: "Cocktails, Dinner & Vinyl DJ Sets"
    }
  },
  gallery: {
    title: "Studio Sessions",
    images: [
      "https://cdn.pixabay.com/photo/2021/09/06/05/55/love-6600903_1280.jpg",
      "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      "https://cdn.pixabay.com/photo/2023/08/08/09/20/wedding-8176868_1280.jpg",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800"
    ]
  },
  rsvp: {
    ticketTitle: "Admit One",
    deadline: "May 15, 2025",
    confirmationMessage: "You're on the list. Get ready to spin."
  }
};

// THE MERGE FUNCTION
// This maps flat JSON data (from niches.json) into the nested Config structure
export function mergeConfig(nicheData: any): VinylThemeConfig {
  // If nicheData is null or undefined, use defaults
  if (!nicheData) return defaultContent;

  return {
    ...defaultContent,
    hero: {
      ...defaultContent.hero,
      // Map 'h1' from JSON to 'hero.title'
      title: nicheData.h1 || defaultContent.hero.title,
      names: nicheData.names || defaultContent.hero.names,
    },
    style: {
      ...defaultContent.style,
      // Map 'color' from JSON to 'style.primaryColor'
      primaryColor: nicheData.color || defaultContent.style.primaryColor,
      // Allow overriding audio/texture if provided
      audioTrack: nicheData.audioTrack || nicheData.audio || defaultContent.style.audioTrack,
      recordTexture: nicheData.recordTexture || defaultContent.style.recordTexture,
      backgroundTexture: nicheData.backgroundTexture || defaultContent.style.backgroundTexture,
    }
  };
}
