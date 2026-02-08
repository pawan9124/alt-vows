'use client';

import React, { useRef, useState } from 'react';
import { Plus, X, Upload, Link as LinkIcon } from 'lucide-react';

interface ImageListFieldProps {
    label: string;
    values: string[] | null | undefined; // Array of URLs
    onChange: (values: string[]) => void;
}

export const ImageListField = ({ label, values = [], onChange }: ImageListFieldProps) => {
    const safeValues = values || [];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAddingUrl, setIsAddingUrl] = useState(false);
    const [tempUrl, setTempUrl] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                onChange([...safeValues, result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddUrl = () => {
        if (tempUrl) {
            onChange([...safeValues, tempUrl]);
            setTempUrl('');
            setIsAddingUrl(false);
        }
    };

    const handleRemove = (index: number) => {
        const newValues = safeValues.filter((_, i) => i !== index);
        onChange(newValues);
    };

    return (
        <div className="space-y-3">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />

            <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-semibold text-white/40 block">
                    {label} ({safeValues.length})
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAddingUrl(!isAddingUrl)}
                        className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white uppercase transition-colors"
                        title="Add via URL"
                    >
                        <LinkIcon className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 hover:text-yellow-400 uppercase transition-colors"
                    >
                        <Upload className="w-3 h-3" /> Add Photo
                    </button>
                </div>
            </div>

            {isAddingUrl && (
                <div className="flex gap-2 animate-fade-in">
                    <input
                        type="text"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 bg-black border border-white/10 rounded px-2 py-1 text-xs text-blue-300 focus:border-yellow-500/50 outline-none"
                        autoFocus
                    />
                    <button onClick={handleAddUrl} className="px-3 py-1 bg-blue-600 text-[10px] font-bold text-white rounded uppercase">
                        Add
                    </button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2">
                {safeValues.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img
                            src={url}
                            alt={`Gallery item ${index}`}
                            className="w-full h-full object-cover rounded-lg border border-white/10"
                        />
                        {/* Remove Button */}
                        <button
                            onClick={() => handleRemove(index)}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Remove Photo"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {/* Add Button as last grid item */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1 text-white/40 hover:text-white/60 hover:border-white/40 transition-all group"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] uppercase font-bold mt-1">Upload</span>
                </button>
            </div>
        </div>
    );
};
