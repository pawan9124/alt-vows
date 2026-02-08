'use client';

import React, { useState, useRef } from 'react';
import { Image as ImageIcon, X, Upload, Link as LinkIcon } from 'lucide-react';

interface ImageFieldProps {
    label: string;
    value: string | null | undefined;
    onChange: (value: string) => void;
}

export const ImageField = ({ label, value, onChange }: ImageFieldProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(value || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onChange(tempUrl);
        setIsEditing(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                onChange(result);
                setTempUrl(result);
                setIsEditing(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase font-semibold text-white/40 block">
                {label}
            </label>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />

            {value ? (
                // STATE 1: Image Exists
                <div className="relative group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-white/10"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            title="Upload New"
                        >
                            <Upload className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            title="Paste URL"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onChange('')}
                            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                            title="Remove Image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                // STATE 2: Placeholder
                <div className="flex gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 h-24 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/60 hover:border-white/40 transition-all group"
                    >
                        <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs uppercase font-semibold">Upload</span>
                    </button>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-1/3 h-24 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all"
                        title="Paste URL"
                    >
                        <LinkIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {isEditing && (
                <div className="mt-2 flex gap-2 animate-fade-in">
                    <input
                        type="text"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 bg-black border border-white/10 rounded px-2 py-1 text-xs text-blue-300 focus:border-yellow-500/50 outline-none"
                        autoFocus
                    />
                    <button onClick={handleSave} className="px-3 py-1 bg-yellow-600 text-[10px] font-bold text-black rounded uppercase">
                        Set
                    </button>
                </div>
            )}
        </div>
    );
};
