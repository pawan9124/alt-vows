'use client';

import React, { useState } from 'react';
import { SectionSchema, FieldSchema } from '../types/theme';
import { ImageUpload } from './ImageUpload';

// Replicating EditorSidebarProps partly or importing it if circular dependency isn't an issue.
// For now, I'll define the subset of props we need.
interface DynamicEditorProps {
    schema: SectionSchema[];
    content: any;
    onHeroChange: (field: string, value: string) => void;
    onLogisticsChange: (section: string, field: string, value: string) => void;
    onStoryChange: (index: number, field: string, value: string) => void;
    onRSVPChange: (field: string, value: string) => void;
    onGalleryChange?: (field: string, value: any) => void;
    onRegistryChange?: (index: number, field: string, value: string) => void;
    onThemeUpdate?: (section: string, field: string, value: any) => void;
}

export const DynamicEditor: React.FC<DynamicEditorProps> = ({
    schema,
    content,
    onHeroChange,
    onLogisticsChange,
    onStoryChange,
    onRSVPChange,
    onGalleryChange,
    onRegistryChange,
    onThemeUpdate,
}) => {

    // Helper to resolve value from path
    const getValue = (section: string, field: string, parentData?: any) => {
        const data = parentData || content[section];
        if (!data) return '';
        return data[field] || '';
    };

    const handleFieldChange = (section: string, field: FieldSchema, value: any, arrayIndex?: number, parentKey?: string) => {
        // 1. HERO
        if (section === 'hero') {
            onHeroChange(field.key, value);
        }
        // 2. STORY
        else if (section === 'story') {
            // If inside an array (events)
            if (arrayIndex !== undefined) {
                // Existing onStoryChange expects (index, field, value)
                // But wait, the standard onStoryChange in EditorSidebar might be specific to generic stories.
                // Let's assume standard behavior: if index provided, it's an event update.
                // If generic root field (title/subtitle), index is -1
                onStoryChange(arrayIndex, field.key, value);
            } else {
                // Root level story field
                onStoryChange(-1, field.key, value);
            }
        }
        // 3. LOGISTICS
        else if (section === 'logistics') {
            // If we are editing a nested group like 'ceremony', the field.key might be 'time'.
            // The parentKey would be 'ceremony'.
            if (parentKey) {
                onLogisticsChange(parentKey, field.key, value);
            } else {
                // Root fields: 'title', 'subtitle' -> use special key '_root' based on Development.tsx
                onLogisticsChange('_root', field.key, value);
            }
        }
        // 4. RSVP
        else if (section === 'rsvp') {
            onRSVPChange(field.key, value);
        }
        // 5. GALLERY
        else if (section === 'gallery') {
            if (onGalleryChange) onGalleryChange(field.key, value);
        }
        // 6. GENERIC FALLBACK (e.g. adventure, thankYou, details)
        else {
            console.log('DynamicEditor: Falling back to Generic Update', { section, field: field.key, value });
            if (onThemeUpdate) {
                onThemeUpdate(section, field.key, value);
            } else {
                console.warn('DynamicEditor: onThemeUpdate is missing for generic section', section);
            }
        }
    };

    const renderField = (
        section: string,
        field: FieldSchema,
        value: any,
        onChange: (val: any) => void
    ) => {
        const label = field.label || field.key;

        if (field.type === 'text') {
            return (
                <div key={field.key} className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-white/60">{label}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                        placeholder={field.placeholder}
                    />
                </div>
            );
        }

        if (field.type === 'textarea') {
            return (
                <div key={field.key} className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-white/60">{label}</label>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-[#0A0A0A] border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors resize-none"
                        rows={3}
                        placeholder={field.placeholder}
                    />
                </div>
            );
        }

        if (field.type === 'image' || field.type === 'video') {
            return (
                <div key={field.key} className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-white/60">{label}</label>
                    <ImageUpload
                        currentImage={value}
                        onUpload={onChange}
                        label=""
                    />
                </div>
            );
        }

        return null;
    };

    // Render a generic array (like Story Events)
    const renderArray = (section: string, field: FieldSchema, items: any[]) => {
        if (!items || !Array.isArray(items)) return null;

        return (
            <div key={field.key} className="space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-3">
                        <h4 className="text-xs font-medium text-white/60">{field.label} {idx + 1}</h4>
                        {field.itemSchema?.map(subField => {
                            return renderField(
                                section,
                                subField,
                                item[subField.key],
                                (val) => handleFieldChange(section, subField, val, idx) // Pass index!
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    // Render a Group (like Logistics Ceremony)
    const renderGroup = (section: string, field: FieldSchema) => {
        const groupData = content[section]?.[field.key] || {};

        return (
            <div key={field.key} className="bg-[#0A0A0A] p-4 rounded border border-white/10 space-y-4 mb-4">
                <h4 className="text-xs font-medium text-white/60 uppercase">{field.label}</h4>
                {field.fields?.map(subField => (
                    renderField(
                        section,
                        subField,
                        groupData[subField.key],
                        (val) => handleFieldChange(section, subField, val, undefined, field.key)
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {schema.map((sectionSchema) => {
                // Render Section Header
                return (
                    <div key={sectionSchema.section}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px flex-1 bg-white/10"></div>
                            <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">{sectionSchema.label}</h3>
                            <div className="h-px flex-1 bg-white/10"></div>
                        </div>

                        <div className="space-y-4">
                            {sectionSchema.fields.map(field => {
                                if (field.type === 'array') {
                                    const arrayData = content[sectionSchema.section]?.[field.key] || [];
                                    return renderArray(sectionSchema.section, field, arrayData);
                                }

                                if (field.type === 'group') {
                                    return renderGroup(sectionSchema.section, field);
                                }

                                // Regular Top Level Field in Section
                                const val = getValue(sectionSchema.section, field.key);
                                return renderField(sectionSchema.section, field, val, (v) => handleFieldChange(sectionSchema.section, field, v));
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
