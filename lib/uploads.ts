// @ts-nocheck
import { supabase } from './supabase';
import imageCompression from 'browser-image-compression';

export const uploadImage = async (file: File) => {
  try {
    // 1. Optimize (Images Only)
    let fileToUpload = file;

    // Only compress if it is an image
    if (file.type.startsWith('image/')) {
      console.log(`Original size: ${file.size / 1024 / 1024} MB`);
      const options = {
        maxSizeMB: 0.5,          // Max size ~500KB
        maxWidthOrHeight: 1920,  // Max width for full screen
        useWebWorker: true,
        fileType: 'image/webp'   // Convert to WebP (Modern & Small)
      };
      try {
        fileToUpload = await imageCompression(file, options);
        console.log(`Compressed size: ${fileToUpload.size / 1024 / 1024} MB`);
      } catch (e) {
        console.warn("Compression failed, using original file", e);
      }
    } else {
      console.log("Skipping compression for non-image file:", file.type);
    }

    // 2. Create a unique file name (prevents collisions)
    const originalExt = file.name.split('.').pop() || 'bin';
    // If we compressed it, it's webp. If not, keep original.
    const fileExt = (fileToUpload !== file) ? 'webp' : originalExt;
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // 3. Upload to Supabase
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, fileToUpload);

    if (error) {
      throw error;
    }

    // 4. Get the Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};