import { supabase } from '../lib/supabase';
import { GenerationRecord, GenerationParameters } from '../types';

/**
 * Save generation record to database
 */
export const saveGeneration = async (
  userId: string,
  imageUrl: string | null,
  videoUrl: string | null,
  parameters: GenerationParameters
): Promise<GenerationRecord> => {
  const { data, error } = await supabase
    .from('generations')
    .insert({
      user_id: userId,
      image_url: imageUrl,
      video_url: videoUrl,
      parameters: parameters
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save generation: ${error.message}`);
  }

  return data as GenerationRecord;
};

/**
 * Get user's generation history
 */
export const getUserGenerations = async (
  userId: string,
  limit: number = 50
): Promise<GenerationRecord[]> => {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch generations: ${error.message}`);
  }

  return data as GenerationRecord[];
};

/**
 * Get a single generation by ID
 */
export const getGenerationById = async (
  generationId: string
): Promise<GenerationRecord | null> => {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', generationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch generation: ${error.message}`);
  }

  return data as GenerationRecord;
};

/**
 * Delete a generation record
 */
export const deleteGeneration = async (generationId: string): Promise<void> => {
  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', generationId);

  if (error) {
    throw new Error(`Failed to delete generation: ${error.message}`);
  }
};

/**
 * Update generation record (e.g., after editing)
 */
export const updateGeneration = async (
  generationId: string,
  updates: {
    image_url?: string | null;
    video_url?: string | null;
    parameters?: Partial<GenerationParameters>;
  }
): Promise<GenerationRecord> => {
  const { data, error } = await supabase
    .from('generations')
    .update(updates)
    .eq('id', generationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update generation: ${error.message}`);
  }

  return data as GenerationRecord;
};

