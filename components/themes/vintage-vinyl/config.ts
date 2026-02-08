export type ThemeVibe = 'classic' | 'dark' | 'luxury' | 'fresh' | 'fun';

// 1. Define the Global DNA
export interface GlobalThemeConfig {
  palette: {
    primary: string;    // Main brand color
    secondary: string;  // Contrast/Dark color
    text: string;       // Text color
  };
  typography: {
    headingFont: string; // e.g., "Metal Mania"
    bodyFont: string;    // e.g., "Inter"
  };
  assets: {
    recordTexture: string; // The vinyl record image
    cursor?: string;       // Optional custom cursor
  };
}

// 2. Define Page-Specific Configs
export interface LandingPageConfig {
  mode: 'split-screen' | 'centered';
  backgroundValue: string; // URL to poster image or hex color
  overlayOpacity?: number;
  titleSize?: 'normal' | 'huge';
}

export interface GatekeeperConfig {
  // Background Layer
  backgroundTexture?: string;  // e.g., Concrete URL
  backgroundColor?: string;    // Fallback color

  // The Halo Layer (Behind Card)
  showVinylBackdrop?: boolean; // If true, render a record behind the card
  neonColor?: string;          // e.g., "#e02e2e" (The glow color)

  // The Card Layer
  cardTexture?: string;        // e.g., Leather URL
  cardColor?: string;          // Fallback color
  cardShape?: 'square' | 'rounded';
  // The Decorations
  cornerShape?: {
    path: string;       // The SVG path data (d attribute)
    viewBox: string;    // The SVG viewBox
    color?: string;     // Optional override color
    size?: string;      // Width/Height
  };

  // The Button
  buttonStyle?: 'solid' | 'glow' | 'outline';
  buttonShape?: 'pill' | 'rectangle' | 'rounded';
  buttonColor?: string;        // Uses global primary if undefined
}

export interface PlayerConfig {
  backgroundValue: string; // Readable texture for lyrics
  layout: 'standard' | 'minimal';
  // Left Panel (Content)
  leftPanelTexture?: string;   // URL for the booklet background
  leftPanelColor?: string;     // Text color

  // Right Panel (Player)
  rightPanelTexture?: string; // Optional background for the player side
  glowColor?: string;          // The color of the beat pulse

  // Elements
  photoFrameStyle?: 'polaroid' | 'tape' | 'minimal' | 'gold';
  rsvpButtonAsset?: string; // Path to the ticket image (e.g., "/assets/ticket.png")
}

export interface VinylThemeConfig {
  slug: string; // <--- Added for navigation
  hero: {
    names: string;
    title: string;
    date: string;
    location: string;
  };
  // NEW STYLE CONFIG
  theme: {
    global: GlobalThemeConfig;
    pages: {
      landing: LandingPageConfig;
      gatekeeper: GatekeeperConfig;
      player: PlayerConfig;
    };
  };
  style?: { // Keeping optional style for backward compatibility if needed temporarily, but goal is to move to theme
    // Deprecated properties might be accessed by old code, but we are refactoring index.tsx too.
    // Let's remove them to force errors and fix index.tsx
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
  slug: 'default',
  hero: {
    names: "Alex & Sam",
    title: "Side A: The Beginning",
    date: "OCT 31, 2026",
    location: "The Velvet Underground"
  },
  theme: {
    global: {
      palette: {
        primary: "#000000",
        secondary: "#ffffff",
        text: "#000000" // Default text
      },
      typography: {
        headingFont: "Inter",
        bodyFont: "Inter"
      },
      assets: {
        recordTexture: "/themes/vintage-vinyl/record.png"
      }
    },
    pages: {
      landing: {
        mode: "centered",
        backgroundValue: "#f0f0f0", // Default bg
        overlayOpacity: 0.5,
        titleSize: "normal"
      },
      gatekeeper: {
        backgroundColor: "#2c241b",
        cardColor: "#f9f5eb",
        cardShape: "rounded",
        buttonShape: "rounded",
        buttonStyle: "solid"
      },
      player: {
        backgroundValue: "#ffffff",
        layout: "standard",
        leftPanelColor: "#1e100b",
        glowColor: "#a855f7", // Default Purple
        photoFrameStyle: "polaroid"
      }
    }
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

const VIBE_STYLES: Record<ThemeVibe, { envelope: string; paper: string; accent: string }> = {
  classic: { envelope: "#2c241b", paper: "#f9f5eb", accent: "#d4af37" },
  dark: { envelope: "#1a1a1a", paper: "#333333", accent: "#dc2626" },
  luxury: { envelope: "#0f172a", paper: "#e2e8f0", accent: "#fbbf24" },
  fresh: { envelope: "#3f4d3f", paper: "#fafaf9", accent: "#a3b18a" },
  fun: { envelope: "#be185d", paper: "#fff1f2", accent: "#f472b6" },
};

// THE MERGE FUNCTION
// This maps flat JSON data (from niches.json) into the nested Config structure
export function mergeConfig(nicheData: any): VinylThemeConfig {
  // If nicheData is null or undefined, use defaults
  if (!nicheData) return defaultContent;

  if (nicheData.theme) {
    // If the data already has the new 'theme' structure (like our updated Rock & Roll entry), use it.
    // We still merge with defaultContent to ensure completeness.
    return {
      ...defaultContent,
      ...nicheData,
      slug: nicheData.slug || defaultContent.slug, // Pass slug through
      theme: {
        global: { ...defaultContent.theme.global, ...nicheData.theme.global },
        pages: {
          landing: { ...defaultContent.theme.pages.landing, ...nicheData.theme.pages?.landing },
          gatekeeper: { ...defaultContent.theme.pages.gatekeeper, ...nicheData.theme.pages?.gatekeeper },
          player: { ...defaultContent.theme.pages.player, ...nicheData.theme.pages?.player },
        }
      }
    };
  }

  // Fallback for old flat data structure
  // 1. Determine Vibe
  const vibe = (nicheData.vibe as ThemeVibe) || 'classic';
  const palette = VIBE_STYLES[vibe] || VIBE_STYLES['classic'];

  return {
    ...defaultContent,
    slug: nicheData.slug || defaultContent.slug, // Pass slug through
    hero: {
      ...defaultContent.hero,
      title: nicheData.h1 || defaultContent.hero.title,
      names: nicheData.names || defaultContent.hero.names,
    },
    theme: {
      global: {
        palette: {
          primary: nicheData.color || palette.accent,
          secondary: palette.envelope, // Mapping rough equivalents
          text: "#ffffff" // Assuming dark themes mostly for now, or we could pick based on vibe
        },
        typography: {
          headingFont: nicheData.googleFont || "Inter",
          bodyFont: "Inter"
        },
        assets: {
          recordTexture: nicheData.recordTexture || defaultContent.theme.global.assets.recordTexture
        }
      },
      pages: {
        landing: {
          mode: nicheData.layoutMode === 'landing' ? 'split-screen' : 'centered', // Mapping 'landing' to 'split-screen' purely as a guess or default
          backgroundValue: nicheData.backgroundTexture || defaultContent.theme.pages.landing.backgroundValue,
          titleSize: "normal"
        },
        gatekeeper: {
          backgroundColor: nicheData.envelopeColor || palette.envelope,
          cardColor: palette.paper,
          buttonStyle: "solid"
        },
        player: {
          backgroundValue: nicheData.backgroundTexture || "",
          layout: "standard",
          leftPanelColor: palette.envelope, // Fallback
          glowColor: nicheData.color || palette.accent, // Fallback
        }
      }
    }
  };
}
