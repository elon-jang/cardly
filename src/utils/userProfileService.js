import { supabase } from '../lib/supabase';

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

export const createUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{
      user_id: userId,
      name: profileData.name,
      title: profileData.title,
      phone: profileData.phone,
      email: profileData.email,
      instagram: profileData.instagram,
      blog: profileData.blog,
    }])
    .select()
    .single();

  return { data, error };
};

export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      name: profileData.name,
      title: profileData.title,
      phone: profileData.phone,
      email: profileData.email,
      instagram: profileData.instagram,
      blog: profileData.blog,
    })
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
};

export const upsertUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      name: profileData.name,
      title: profileData.title,
      phone: profileData.phone,
      email: profileData.email,
      instagram: profileData.instagram,
      blog: profileData.blog,
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  return { data, error };
};
