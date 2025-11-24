import { supabase } from '../lib/supabase';

export const getUserCustomImages = async (userId) => {
  const { data, error } = await supabase
    .from('custom_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  return { data, error };
};

export const addCustomImage = async (userId, imageData) => {
  const { data, error } = await supabase
    .from('custom_images')
    .insert([{
      user_id: userId,
      image_data: imageData
    }])
    .select()
    .single();

  return { data, error };
};

export const deleteCustomImage = async (imageId) => {
  const { error } = await supabase
    .from('custom_images')
    .delete()
    .eq('id', imageId);

  return { error };
};
