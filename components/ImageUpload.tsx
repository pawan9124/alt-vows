'use client';

import React, { useState, useRef } from 'react';
import { uploadImage } from '../lib/uploads';

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onUpload, label = "Upload Photo" }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setUploading(true);

    try {
      // 1. Compress and Upload
      const publicUrl = await uploadImage(file);
      // 2. Pass the new URL back to the parent
      onUpload(publicUrl);
    } catch (error) {
      alert('Error uploading image. Please try again.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {label && <label className="text-xs font-medium text-white/60">{label}</label>}

      <div className="flex items-center gap-3">
        {/* PREVIEW */}
        <div className="relative w-16 h-16 rounded overflow-hidden border border-white/10 bg-[#0A0A0A] flex-shrink-0">
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
            </div>
          ) : currentImage ? (
            currentImage.match(/\.(mp4|webm|mov)$/i) ? (
              <video src={currentImage} className="w-full h-full object-cover" autoPlay muted loop playsInline />
            ) : (
              <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No img</div>
          )}
        </div>

        {/* HIDDEN INPUT + CUSTOM BUTTON */}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-[#0A0A0A] hover:bg-white/5 text-white text-xs px-3 py-2 rounded transition-colors border border-white/10 active:scale-[0.98]"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};