'use client';

import React, { useState, useMemo } from 'react';
import { useEditorStore, getNestedValue } from '@/store/useEditorStore';
import { vintageVinylSchema } from '@/data/schemas/vintageVinly';
import { voyagerSchema } from '@/data/schemas/voyager';
import { X, Settings, Save, Loader2, Lock } from 'lucide-react';
import { ImageField } from './fields/ImageField';
import { ImageListField } from './fields/ImageListField';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { PublishButton } from '@/components/PublishButton';
import { FREE_FIELDS } from '@/lib/generateSiteId';

// Schema registry — maps theme_id to its editor schema
const SCHEMA_REGISTRY: Record<string, any[]> = {
    'vintage-vinyl': vintageVinylSchema,
    'the-voyager': voyagerSchema,
};

interface SchemaField {
    key: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
}

interface EditorSidebarProps {
    siteStatus?: string;
}

export const EditorSidebar = ({ siteStatus = 'demo' }: EditorSidebarProps) => {
    const { activeTheme, updateField, isOpen, toggleEditor } = useEditorStore();
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const isDemo = siteStatus !== 'production';

    // Resolve the correct theme_id from activeTheme
    const themeId = (activeTheme as any)?.themeId || (activeTheme as any)?.theme_id || 'vintage-vinyl';

    // Dynamically select the schema based on theme_id
    const activeSchema = useMemo(() => {
        return SCHEMA_REGISTRY[themeId] || vintageVinylSchema;
    }, [themeId]);

    if (!activeTheme) return null;

    // --- THE NEW SAVE FUNCTION ---
    const handleSave = async () => {
        // Gate behind auth
        if (!user) {
            alert('Please sign in to save your changes. Visit /auth to log in.');
            return;
        }

        setIsSaving(true);
        try {
            // 1. Extract site_id from the URL: /demo/{siteId}/{slug}
            const pathParts = window.location.pathname.split('/');
            const siteId = pathParts[2] || null; // /demo/{siteId}/{slug}
            const slug = activeTheme.slug;

            if (!siteId) {
                throw new Error('Cannot determine site ID from URL. Please reload and try again.');
            }

            // 2. Write to Supabase (include site_id + owner_id for RLS)
            const { error } = await supabase
                .from('websites')
                .upsert({
                    site_id: siteId,
                    slug: slug,
                    theme_id: themeId,
                    content: activeTheme,
                    owner_id: user.id
                }, { onConflict: 'site_id' });

            if (error) throw error;

            alert('Success! Your theme is saved to the cloud.');
        } catch (err) {
            console.error(err);
            alert('Error saving: ' + (err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };
    // -----------------------------

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={toggleEditor}
                className={`fixed bottom-6 right-6 z-50 bg-black text-white p-3 rounded-full shadow-2xl border border-white/20 transition-all hover:scale-110 ${isOpen ? 'hidden' : 'block'}`}
            >
                <Settings className="w-6 h-6" />
            </button>

            {/* Sidebar Drawer */}
            <div className={`fixed inset-y-0 right-0 z-[100] w-full sm:w-96 bg-[#111] border-l border-white/10 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
                    <h2 className="text-white font-bold tracking-wider text-sm">THEME EDITOR</h2>
                    <button onClick={toggleEditor} className="text-white/60 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Inputs */}
                <div className="p-6 overflow-y-auto h-[calc(100vh-64px)] space-y-8 pb-20">
                    {activeSchema.map((section) => (
                        <div key={section.id} className="space-y-4">
                            <h3 className="text-xs font-bold text-yellow-500/80 uppercase tracking-widest border-b border-white/5 pb-2">
                                {section.label}
                            </h3>

                            <div className="space-y-4">
                                {section.fields.map((f: any) => {
                                    const field = f as SchemaField;
                                    const val = getNestedValue(activeTheme, field.key);
                                    const isLocked = isDemo && !FREE_FIELDS.includes(field.key);

                                    return (
                                        <div key={field.key} className={`space-y-2 ${isLocked ? 'opacity-50' : ''}`}>
                                            {/* Label for simple fields */}
                                            {field.type !== 'image' && field.type !== 'image-list' && (
                                                <label className="text-[10px] uppercase font-semibold text-white/40 block flex items-center gap-1.5">
                                                    {isLocked && <Lock className="w-3 h-3 text-yellow-500/60" />}
                                                    {field.label}
                                                    {isLocked && (
                                                        <span className="text-yellow-500/50 text-[8px] ml-auto">Publish to unlock</span>
                                                    )}
                                                </label>
                                            )}

                                            {/* Locked overlay */}
                                            {isLocked ? (
                                                <div className="w-full bg-black/50 border border-white/5 rounded px-3 py-2 text-sm text-white/20 cursor-not-allowed select-none">
                                                    {field.type === 'image' || field.type === 'image-list' ? (
                                                        <div className="flex items-center gap-2">
                                                            <Lock className="w-3 h-3 text-yellow-500/40" />
                                                            <span className="text-[10px] uppercase text-yellow-500/40">{field.label} — Publish to unlock</span>
                                                        </div>
                                                    ) : (
                                                        val || field.placeholder || '•••'
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    {field.type === 'text' && (
                                                        <input
                                                            type="text"
                                                            value={val || ''}
                                                            onChange={(e) => updateField(field.key, e.target.value)}
                                                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-yellow-500/50 outline-none transition-colors"
                                                            placeholder={field.placeholder}
                                                        />
                                                    )}

                                                    {field.type === 'textarea' && (
                                                        <textarea
                                                            value={val || ''}
                                                            onChange={(e) => updateField(field.key, e.target.value)}
                                                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-yellow-500/50 outline-none transition-colors h-24 resize-none"
                                                            placeholder={field.placeholder}
                                                        />
                                                    )}

                                                    {field.type === 'color' && (
                                                        <div className="flex items-center gap-2 bg-black border border-white/10 rounded p-1">
                                                            <input
                                                                type="color"
                                                                value={val || '#000000'}
                                                                onChange={(e) => updateField(field.key, e.target.value)}
                                                                className="h-6 w-6 bg-transparent border-none cursor-pointer rounded-sm"
                                                            />
                                                            <span className="text-xs text-white/60 font-mono uppercase">{val}</span>
                                                        </div>
                                                    )}

                                                    {/* Smart Image Fields */}
                                                    {field.type === 'image' && (
                                                        <ImageField
                                                            label={field.label}
                                                            value={val}
                                                            onChange={(newValue) => updateField(field.key, newValue)}
                                                        />
                                                    )}

                                                    {field.type === 'image-list' && (
                                                        <ImageListField
                                                            label={field.label}
                                                            values={val}
                                                            onChange={(newValues) => updateField(field.key, newValues)}
                                                        />
                                                    )}

                                                    {field.type === 'select' && (
                                                        <select
                                                            value={val || ''}
                                                            onChange={(e) => updateField(field.key, e.target.value)}
                                                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-yellow-500/50 outline-none"
                                                        >
                                                            {field.options?.map((opt: string) => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* REAL SAVE BUTTON */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 text-black font-bold text-sm rounded transition-all mt-8 uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Changes
                            </>
                        )}
                    </button>

                    {/* Publish Button — only visible for demo sites */}
                    {activeTheme?.slug && (activeTheme as any).status !== 'production' && (
                        <div className="mt-3">
                            <PublishButton slug={activeTheme.slug} compact />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
