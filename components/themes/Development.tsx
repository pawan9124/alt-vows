'use client';

import React, { useState, useMemo } from 'react';
import EnvelopeLuxuryThemePkg from './envelope-luxury-1';
import FrenchPorcelainThemePkg from './french-porcelain';
import RetroSciFiThemePkg from './retro-sci-fi';
import TheVoyagerThemePkg from './the-voyager';
import { EditorSidebar } from '../components/EditorSidebar';

// --- SETUP ---
const ActiveThemePkg = TheVoyagerThemePkg;

const Development = () => {
  const [content, setContent] = useState(ActiveThemePkg.config.defaultContent);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // --- HANDLERS FOR VINTAGE VINYL ---
  // Vintage Vinyl structure:
  // - hero: { names, date, title, location }
  // - story: { title, description, image }
  // - logistics: { title, ceremony, reception }
  // - gallery: { title, images[] }
  // - rsvp: { ticketTitle, deadline, confirmationMessage }

  // 1. HERO HANDLER
  const handleHeroChange = (field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  // 2. LOGISTICS HANDLER
  const handleLogisticsChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => {
      // Handle root-level fields like title (e.g., "The Setlist")
      if (section === '_root') {
        return {
          ...prev,
          logistics: { ...prev.logistics, [field]: value }
        };
      }
      // Handle nested sections like ceremony/reception
      return {
        ...prev,
        logistics: {
          ...prev.logistics,
          [section]: { ...(prev.logistics?.[section] || {}), [field]: value }
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  // 3. STORY HANDLER (Vintage Vinyl has single story object, not array)
  const handleStoryChange = (index: number, field: string, value: string) => {
    setContent((prev: any) => {
      // Check if story is array (Luxury Reveal)
      if (Array.isArray(prev.story)) {
        const newStory = [...prev.story];
        if (newStory[index]) {
          newStory[index] = { ...newStory[index], [field]: value };
        }
        return { ...prev, story: newStory };
      }

      // Check if story has nested events array (Living Hero)
      if (prev.story?.events && Array.isArray(prev.story.events)) {
        if (index === -1) {
          // Root field (title/subtitle)
          return {
            ...prev,
            story: { ...prev.story, [field]: value }
          };
        } else {
          // Event item update
          const newEvents = [...prev.story.events];
          if (newEvents[index]) {
            newEvents[index] = { ...newEvents[index], [field]: value };
          }
          return {
            ...prev,
            story: { ...prev.story, events: newEvents }
          };
        }
      }
      // Fallback for object-based story (Vintage Vinyl)
      return {
        ...prev,
        story: { ...prev.story, [field]: value }
      };
    });
    setHasUnsavedChanges(true);
  };

  // 4. RSVP HANDLER
  const handleRSVPChange = (field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      rsvp: { ...prev.rsvp, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  // 5. GALLERY HANDLER
  const handleGalleryChange = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      gallery: { ...prev.gallery, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleGalleryImageAdd = (imageUrl: string) => {
    setContent((prev: any) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: [...prev.gallery.images, imageUrl]
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleGalleryImageUpdate = (index: number, imageUrl: string) => {
    setContent((prev: any) => {
      const newImages = [...prev.gallery.images];
      newImages[index] = imageUrl;
      return {
        ...prev,
        gallery: {
          ...prev.gallery,
          images: newImages,
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleGalleryImageRemove = (index: number) => {
    setContent((prev: any) => {
      const newImages = [...prev.gallery.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        gallery: {
          ...prev.gallery,
          images: newImages,
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  // Generic fallback
  const handleThemeUpdate = (section: string, field: string, value: any) => {
    setContent((prev: any) => {
      // Handle nested field paths like 'ceremony.venue'
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [parentField]: {
              ...prev[section]?.[parentField],
              [childField]: value,
            },
          },
        };
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setHasUnsavedChanges(false);
    setHasSaved(true);
    setIsSaving(false);
    setTimeout(() => setHasSaved(false), 2000);
  };

  // Adapter to feed content into EditorSidebar format if needed
  // Vintage Vinyl: story is {title, description, image}, hero has names as string
  // We transform it for the *Sidebar* to consume
  const contentForEditor = useMemo(() => {
    // NEW: If schema exists, do NOT transform data. Pass raw content.
    if (ActiveThemePkg.config.schema) {
      return content;
    }

    // LEGACY: Vintage Vinyl story is already an object with title/description/image
    // EditorSidebar expects story as array, so wrap it if it's not already an array
    const storyArray = Array.isArray(content.story)
      ? content.story
      : (content.story ? [content.story] : []);

    return {
      ...content,
      story: storyArray,
      hero: {
        ...content.hero,
      },
      logistics: {
        title: content.logistics?.title,
        ceremony: content.logistics?.ceremony,
        reception: content.logistics?.reception
      }
    };
  }, [content]);

  return (
    <div className="relative flex flex-row h-screen w-full overflow-hidden bg-gray-200">

      {/* 1. THE CANVAS - Expands to 100% when editor closed */}
      <main className={`relative h-full overflow-hidden bg-gray-200 flex flex-col items-center justify-start transition-all duration-300 ${isEditorOpen ? 'w-[75%]' : 'w-full'}`}>
        {/* Scaled Preview - scale changes based on editor state */}
        <div className="w-full h-full overflow-hidden">
          <div
            className={`origin-top-left overflow-y-auto transition-all duration-300 ${isEditorOpen ? 'w-[133.333%] h-[133.333%]' : 'w-full h-full'}`}
            style={{ transform: isEditorOpen ? 'scale(0.75)' : 'scale(1)' }}
          >
            <ActiveThemePkg.component content={content} isEditorOpen={isEditorOpen} weddingId="golden-dev" />
          </div>
        </div>

        {/* Toggle Editor Button */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[101] flex gap-2">
          <button
            onClick={() => setContent(ActiveThemePkg.config.defaultContent)}
            className="bg-black text-white px-4 py-2 rounded shadow text-xs uppercase tracking-wider"
          >
            Reset Content
          </button>
          <button
            onClick={() => setIsEditorOpen(!isEditorOpen)}
            className="bg-white text-black px-4 py-2 rounded shadow text-xs uppercase tracking-wider font-bold"
          >
            {isEditorOpen ? 'Full Preview' : 'Open Editor'}
          </button>
        </div>
      </main>

      {/* 2. THE SIDEBAR - 25% Width, hidden when closed */}
      <aside className={`relative h-full shrink-0 bg-gray-950 border-l border-gray-800 flex flex-col overflow-y-auto z-[100] transition-all duration-300 ${isEditorOpen ? 'w-[25%] opacity-100' : 'w-0 opacity-0 overflow-hidden border-l-0'}`}>
        <div className="w-full h-full flex flex-col">
          <EditorSidebar
            weddingId="golden-dev"
            content={contentForEditor}
            onHeroChange={handleHeroChange}
            onLogisticsChange={handleLogisticsChange}
            onStoryChange={handleStoryChange}
            onRSVPChange={handleRSVPChange}
            onThemeUpdate={handleThemeUpdate}
            onGalleryChange={handleGalleryChange}
            onGalleryImageAdd={handleGalleryImageAdd}
            onGalleryImageUpdate={handleGalleryImageUpdate}
            onGalleryImageRemove={handleGalleryImageRemove}
            onSave={handleSave}
            onLogout={() => { }}
            onBack={() => { }}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            hasSaved={hasSaved}
            onShare={() => { }}
            onViewLive={(e) => e.preventDefault()}
            status="draft"
            schema={ActiveThemePkg.config.schema}
          />
        </div>
      </aside>
    </div>
  );
};

export default Development;
