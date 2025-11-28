import { supabase } from '../lib/supabase';

const STORAGE_BUCKET = 'generations';
const IMAGE_FOLDER = 'images';
const VIDEO_FOLDER = 'videos';

/**
 * Convert base64 data URL to Blob
 */
const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const base64Data = base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Upload image to Supabase Storage
 * @param userId - User ID
 * @param base64Image - Base64 encoded image
 * @param filename - Optional filename, will generate one if not provided
 * @returns Public URL of the uploaded image
 */
export const uploadImage = async (
  userId: string,
  base64Image: string,
  filename?: string
): Promise<string> => {
  const blob = base64ToBlob(base64Image);
  const fileExt = base64Image.match(/data:image\/(png|jpeg|jpg|webp);/)?.[1] || 'png';
  const fileName = filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${userId}/${IMAGE_FOLDER}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, blob, {
      contentType: `image/${fileExt}`,
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Upload video to Supabase Storage (for future use)
 * @param userId - User ID
 * @param videoFile - Video file as Blob or File
 * @param filename - Optional filename
 * @returns Public URL of the uploaded video
 */
export const uploadVideo = async (
  userId: string,
  videoFile: Blob | File,
  filename?: string
): Promise<string> => {
  const fileName = filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;
  const filePath = `${userId}/${VIDEO_FOLDER}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, videoFile, {
      contentType: 'video/mp4',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload video: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Delete file from Supabase Storage
 * @param filePath - Full path to the file
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

