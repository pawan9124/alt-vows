'use client';

import React from 'react';
import { useEditorStore, getNestedValue } from '@/store/useEditorStore';
import { vintageVinylSchema } from '@/data/schemas/vintageVinly';
import { X, Settings } from 'lucide-react';
import { ImageField } from './fields/ImageField';
import { ImageListField } from './fields/ImageListField';

interface SchemaField {
    key: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
}

export const EditorSidebar = () => {
    const { activeTheme, updateField, isOpen, toggleEditor } = useEditorStore();

    if (!activeTheme) return null;

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
                    {vintageVinylSchema.map((section) => (
                        <div key={section.id} className="space-y-4">
                            <h3 className="text-xs font-bold text-yellow-500/80 uppercase tracking-widest border-b border-white/5 pb-2">
                                {section.label}
                            </h3>

                            <div className="space-y-4">
                                {section.fields.map((f: any) => {
                                    const field = f as SchemaField;
                                    const val = getNestedValue(activeTheme, field.key);

                                    return (
                                        <div key={field.key} className="space-y-2">
                                            {/* Label is handled inside complex fields, but we keep it for simple ones */}
                                            {field.type !== 'image' && field.type !== 'image-list' && (
                                                <label className="text-[10px] uppercase font-semibold text-white/40 block">
                                                    {field.label}
                                                </label>
                                            )}

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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Dummy Save Button */}
                    <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm rounded transition-all mt-8 uppercase tracking-wide">
                        Save Changes (Demo)
                    </button>
                </div>
            </div>
        </>
    );
};

