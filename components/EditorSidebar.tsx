import React from 'react';
import { ImageUpload } from './ImageUpload';
import { GuestList } from './GuestList';
import { DynamicEditor } from './DynamicEditor';
import { SectionSchema } from '../types/theme';

interface EditorSidebarProps {
  weddingId: string;
  content: any;
  onHeroChange: (field: string, value: string) => void;
  onLogisticsChange: (section: string, field: string, value: string) => void;
  onStoryChange: (index: number, field: string, value: string) => void;
  onRSVPChange: (field: string, value: string) => void;
  onThemeUpdate: (section: string, field: string, value: any) => void;
  onGalleryChange?: (field: string, value: any) => void;
  onGalleryImageAdd?: (imageUrl: string) => void;
  onGalleryImageUpdate?: (index: number, imageUrl: string) => void;
  onGalleryImageRemove?: (index: number) => void;
  onSave: () => Promise<void>;
  onLogout: () => void;
  onBack: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  hasSaved: boolean;
  onShare: () => void;
  onViewLive: (e: React.MouseEvent) => void;
  status?: 'draft' | 'paid' | null;
  onRegistryChange?: (index: number, field: string, value: string) => void;
  onTravelChange?: (index: number, field: string, value: string) => void;
  onFAQChange?: (index: number, field: string, value: string) => void;
  schema?: SectionSchema[];
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  weddingId,
  content,
  onHeroChange,
  onLogisticsChange,
  onStoryChange,
  onRSVPChange,
  onThemeUpdate,
  onGalleryChange,
  onGalleryImageAdd,
  onGalleryImageUpdate,
  onGalleryImageRemove,
  onSave,
  onLogout,
  onBack,
  hasUnsavedChanges,
  isSaving,
  hasSaved,
  onShare,
  onViewLive,
  status,
  onRegistryChange,
  onTravelChange,
  onFAQChange,
  schema,
}) => {
  return (
    <div className="w-full h-full bg-[#111111] text-white p-4 md:p-6 overflow-y-auto flex flex-col gap-6">
      {/* HEADER - Desktop Only */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded transition-colors text-white/60 hover:text-white"
            title="Back to Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div className="text-center">
            <h2 className="text-base font-medium text-white">Editor</h2>
            <p className="text-xs text-white/40">ID: {weddingId.slice(0, 8)}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/5 rounded transition-colors text-white/60 hover:text-white"
            title="Sign Out"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons Row - Mobile Optimized */}
      <div className="flex flex-col gap-2 mb-4">
        {/* Status Badge */}
        {status && (
          <div className="flex justify-end mb-1">
            {status === 'draft' ? (
              <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Draft Mode
              </span>
            ) : status === 'paid' ? (
              <span className="px-2 py-1 text-xs font-medium rounded bg-green-500/20 text-green-400 border border-green-500/30">
                Live & Published
              </span>
            ) : null}
          </div>
        )}

        {/* Save Button - Primary, Large */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`w-full py-3 rounded text-sm font-medium transition-colors active:scale-[0.98] ${isSaving
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : hasUnsavedChanges
              ? "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              : "bg-white/5 text-white/60 border border-white/10"
            }`}
        >
          {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
        </button>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <button
            onClick={onShare}
            disabled={!hasSaved || status === 'draft'}
            className={`flex-1 py-2 rounded text-xs font-medium transition-colors border ${hasSaved && status !== 'draft'
              ? "bg-[#111111] hover:bg-white/5 text-white border-white/10"
              : "bg-[#0A0A0A] text-white/20 cursor-not-allowed border-white/5"
              }`}
          >
            Share
          </button>
          <a
            href={status === 'draft' ? '#' : `/#/${weddingId}`}
            target="_blank"
            rel="noreferrer"
            onClick={onViewLive}
            className={`flex-1 py-2 rounded text-xs font-medium text-center transition-colors border ${hasSaved && status !== 'draft'
              ? "bg-[#111111] hover:bg-white/5 text-white border-white/10"
              : "bg-[#0A0A0A] text-white/20 cursor-not-allowed border-white/5"
              }`}
          >
            View
          </a>
        </div>
      </div>

      {/* EDITING FORM INPUTS - Mobile First */}
      {schema ? (
        <>
          <DynamicEditor
            schema={schema}
            content={content}
            onHeroChange={onHeroChange}
            onLogisticsChange={onLogisticsChange}
            onStoryChange={onStoryChange}
            onRSVPChange={onRSVPChange}
            onGalleryChange={onGalleryChange}
            onRegistryChange={onRegistryChange}
            onThemeUpdate={onThemeUpdate}
          />
          {/* Always show Guest List for now */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Guests</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="bg-[#0A0A0A] rounded border border-white/10">
              <GuestList weddingId={weddingId} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Hero</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {content.hero?.title !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Title</label>
                <input
                  type="text"
                  value={content.hero?.title || ''}
                  onChange={(e) => onHeroChange('title', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="We Are Getting Married"
                />
              </div>
            )}
            {content.hero?.names !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Couple Names</label>
                <input
                  type="text"
                  value={content.hero?.names || ''}
                  onChange={(e) => onHeroChange('names', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Emma & Ashley"
                />
              </div>
            )}
            {content.hero?.date !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Date</label>
                <input
                  type="text"
                  value={content.hero?.date || ''}
                  onChange={(e) => onHeroChange('date', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="October 26th, 2025"
                />
              </div>
            )}
            {content.hero?.location !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Location</label>
                <input
                  type="text"
                  value={content.hero?.location || ''}
                  onChange={(e) => onHeroChange('location', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Williamsburg, Brooklyn"
                />
              </div>
            )}
            {content.hero?.backgroundImage !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Background Photo</label>
                <ImageUpload
                  currentImage={content.hero?.backgroundImage}
                  onUpload={(newUrl) => onHeroChange('backgroundImage', newUrl)}
                  label=""
                />
              </div>
            )}

            {/* Living Hero 1 Extra Fields */}
            {content.hero?.coupleImage !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Couple Photo</label>
                <ImageUpload
                  currentImage={content.hero?.coupleImage}
                  onUpload={(newUrl) => onHeroChange('coupleImage', newUrl)}
                  label=""
                />
              </div>
            )}

            {content.hero?.backgroundVideo !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Background Video</label>
                <ImageUpload
                  currentImage={content.hero?.backgroundVideo}
                  onUpload={(newUrl) => onHeroChange('backgroundVideo', newUrl)}
                  label=""
                />
              </div>
            )}

            {content.hero?.foregroundVideo !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Foreground Video</label>
                <ImageUpload
                  currentImage={content.hero?.foregroundVideo}
                  onUpload={(newUrl) => onHeroChange('foregroundVideo', newUrl)}
                  label=""
                />
              </div>
            )}

            {/* Dynamic Fields for Landing Page (Golden Gatefold etc) */}
            {content.hero?.monogram !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Monogram</label>
                <input
                  type="text"
                  value={content.hero.monogram}
                  onChange={(e) => onHeroChange('monogram', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="V&A"
                />
              </div>
            )}

            {content.hero?.buttonText !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Button Text</label>
                <input
                  type="text"
                  value={content.hero.buttonText}
                  onChange={(e) => onHeroChange('buttonText', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="TAP TO OPEN"
                />
              </div>
            )}
          </div>

          {/* STORY SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Story</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* Section Title/Subtitle for Living Hero */}
            {content.story?.title !== undefined && (
              <div className="flex flex-col gap-3 mb-4">
                <label className="text-xs font-medium text-white/60">Section Title</label>
                <input
                  type="text"
                  value={content.story.title}
                  onChange={(e) => onStoryChange(-1, 'title', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="How We Got Here"
                />
              </div>
            )}
            {content.story?.subtitle !== undefined && (
              <div className="flex flex-col gap-3 mb-4">
                <label className="text-xs font-medium text-white/60">Section Subtitle</label>
                <input
                  type="text"
                  value={content.story.subtitle}
                  onChange={(e) => onStoryChange(-1, 'subtitle', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Love Story"
                />
              </div>
            )}

            {(() => {
              // Safely handle story - convert object to array if needed
              let storyArray: any[] = [];
              if (content.story) {
                if (Array.isArray(content.story)) {
                  storyArray = content.story;
                } else if (content.story.events && Array.isArray(content.story.events)) {
                  // Living Hero structure: { title, subtitle, events: [] }
                  storyArray = content.story.events;
                } else if (typeof content.story === 'object') {
                  // Fallback for single object (legacy)
                  // Only treat as simple event if it DOES NOT have 'events' key
                  if (!content.story.events) {
                    storyArray = [content.story];
                  }
                }
              }
              return storyArray.map((item: any, index: number) => (
                <div key={index} className="bg-[#0A0A0A] p-4 rounded border border-white/10 mb-4 space-y-3">
                  <h4 className="text-xs font-medium text-white/60">Event {index + 1}</h4>
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-white/60">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => onStoryChange(index, 'title', e.target.value)}
                      className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="The First Date"
                    />
                  </div>

                  {/* Extra Fields for Living Hero */}
                  {item.year !== undefined && (
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-medium text-white/60">Year</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => onStoryChange(index, 'year', e.target.value)}
                        className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                        placeholder="2021"
                      />
                    </div>
                  )}
                  {item.location !== undefined && (
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-medium text-white/60">Location</label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => onStoryChange(index, 'location', e.target.value)}
                        className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                        placeholder="New York"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-white/60">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => onStoryChange(index, 'description', e.target.value)}
                      className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors resize-none"
                      placeholder="Event description..."
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-white/60">Photo</label>
                    <ImageUpload
                      currentImage={item.image || item.img}
                      onUpload={(newUrl) => onStoryChange(index, 'image', newUrl)}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* LOGISTICS SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Logistics</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* Logistics Section Title (for themes like Vintage Vinyl) */}
            {content.logistics?.title !== undefined && (
              <div className="flex flex-col gap-3 mb-4">
                <label className="text-xs font-medium text-white/60">Section Title</label>
                <input
                  type="text"
                  value={content.logistics?.title || ''}
                  onChange={(e) => onLogisticsChange('_root', 'title', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="The Setlist"
                />
              </div>
            )}

            {content.logistics?.subtitle !== undefined && (
              <div className="flex flex-col gap-3 mb-4">
                <label className="text-xs font-medium text-white/60">Section Subtitle</label>
                <input
                  type="text"
                  value={content.logistics?.subtitle || ''}
                  onChange={(e) => onLogisticsChange('_root', 'subtitle', e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Logistics"
                />
              </div>
            )}

            {content.logistics?.ceremony && (
              <div className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4 mb-4">
                <h4 className="text-xs font-medium text-white/60 uppercase">Ceremony</h4>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/60">Time</label>
                  <input
                    type="text"
                    value={content.logistics?.ceremony?.time || ''}
                    onChange={(e) => onLogisticsChange('ceremony', 'time', e.target.value)}
                    className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="3:00 PM"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/60">Venue</label>
                  <input
                    type="text"
                    value={content.logistics?.ceremony?.venue || content.logistics?.ceremony?.title || ''}
                    onChange={(e) => onLogisticsChange('ceremony', 'venue', e.target.value)}
                    className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="Venue Name"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/60">Address</label>
                  <input
                    type="text"
                    value={content.logistics?.ceremony?.address || ''}
                    onChange={(e) => onLogisticsChange('ceremony', 'address', e.target.value)}
                    className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
            )}

            {content.logistics?.reception && (
              <div className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4">
                <h4 className="text-xs font-medium text-white/60 uppercase">Reception</h4>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/60">Time</label>
                  <input
                    type="text"
                    value={content.logistics?.reception?.time || ''}
                    onChange={(e) => onLogisticsChange('reception', 'time', e.target.value)}
                    className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="5:30 PM"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/60">Venue</label>
                  <input
                    type="text"
                    value={content.logistics?.reception?.venue || content.logistics?.reception?.title || ''}
                    onChange={(e) => onLogisticsChange('reception', 'venue', e.target.value)}
                    className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="Venue Name"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/60">Address</label>
                  <input
                    type="text"
                    value={content.logistics?.reception?.address || ''}
                    onChange={(e) => onLogisticsChange('reception', 'address', e.target.value)}
                    className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
            )}
          </div>



          {/* GALLERY SECTION */}
          {content.gallery && onGalleryChange && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Gallery</h3>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/60">Title</label>
                  <input
                    type="text"
                    value={content.gallery?.title || ''}
                    onChange={(e) => onGalleryChange('title', e.target.value)}
                    className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="Gallery Title"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-white/60">Images</label>
                  </div>
                  <div className="space-y-3">
                    {content.gallery?.images?.map((imageUrl: string, index: number) => (
                      <div key={index} className="bg-[#000000] p-3 rounded border border-white/10 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-white/40 mb-2">Image {index + 1}</div>
                          {onGalleryImageUpdate ? (
                            <ImageUpload
                              currentImage={imageUrl}
                              onUpload={(newUrl) => onGalleryImageUpdate(index, newUrl)}
                              label=""
                            />
                          ) : (
                            <div className="text-xs text-white/60 truncate">{imageUrl}</div>
                          )}
                        </div>
                        {onGalleryImageRemove && (
                          <button
                            onClick={() => onGalleryImageRemove(index)}
                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors flex-shrink-0"
                            title="Remove image"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add New Image Button */}
                    {onGalleryImageAdd && (
                      <div className="bg-[#000000] p-3 rounded border border-white/10 border-dashed">
                        <div className="text-xs text-white/40 mb-2">Add New Image</div>
                        <ImageUpload
                          currentImage={undefined}
                          onUpload={(newUrl) => onGalleryImageAdd(newUrl)}
                          label=""
                        />
                      </div>
                    )}

                    {(!content.gallery?.images || content.gallery.images.length === 0) && !onGalleryImageAdd && (
                      <div className="text-xs text-white/40 text-center py-4">
                        No images added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RSVP SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">RSVP</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Ticket Title</label>
                <input
                  type="text"
                  value={content.rsvp?.ticketTitle || ''}
                  onChange={(e) => onRSVPChange('ticketTitle', e.target.value)}
                  className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Admit One"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-white/60">Deadline</label>
                <input
                  type="text"
                  value={content.rsvp?.deadline || ''}
                  onChange={(e) => onRSVPChange('deadline', e.target.value)}
                  className="bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="September 1st"
                />
              </div>
            </div>
          </div>

          {/* GUEST LIST SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Guests</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="bg-[#0A0A0A] rounded border border-white/10">
              <GuestList weddingId={weddingId} />
            </div>
          </div>

          {/* --- NEW EDITABLE SECTIONS (Botanical Bliss) --- */}

          {/* REGISTRY - Only show if content has registry */}
          {content.registry && onRegistryChange && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Registry</h3>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4">
                {content.registry.items.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-3 pb-3 border-b border-white/5 last:border-0">
                    <div className="text-xs text-white/40">Item {idx + 1}</div>
                    <input
                      type="text"
                      value={item.store}
                      onChange={(e) => onRegistryChange(idx, 'store', e.target.value)}
                      className="w-full bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm"
                      placeholder="Store Name"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => onRegistryChange(idx, 'url', e.target.value)}
                      className="w-full bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm"
                      placeholder="URL"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRAVEL */}
          {content.travel && onTravelChange && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Travel</h3>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4">
                {content.travel.hotels.map((hotel: any, idx: number) => (
                  <div key={idx} className="space-y-3 pb-3 border-b border-white/5 last:border-0">
                    <div className="text-xs text-white/40">Hotel {idx + 1}</div>
                    <input
                      type="text"
                      value={hotel.name}
                      onChange={(e) => onTravelChange(idx, 'name', e.target.value)}
                      className="w-full bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm"
                      placeholder="Hotel Name"
                    />
                    <input
                      type="text"
                      value={hotel.address}
                      onChange={(e) => onTravelChange(idx, 'address', e.target.value)}
                      className="w-full bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm"
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      value={hotel.bookingUrl}
                      onChange={(e) => onTravelChange(idx, 'bookingUrl', e.target.value)}
                      className="w-full bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm"
                      placeholder="Booking Link"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {content.faqs && onFAQChange && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Q & A</h3>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4">
                {content.faqs.items.map((faq: any, idx: number) => (
                  <div key={idx} className="space-y-3 pb-3 border-b border-white/5 last:border-0">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => onFAQChange(idx, 'question', e.target.value)}
                      className="w-full bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm font-bold"
                      placeholder="Question"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => onFAQChange(idx, 'answer', e.target.value)}
                      className="w-full bg-[#000000] border border-white/10 text-white rounded px-3 py-2 text-sm resize-none"
                      placeholder="Answer"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};
