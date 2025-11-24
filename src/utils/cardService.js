import { supabase } from '../lib/supabase';

export const saveCard = async (cardData, userId) => {
  const { data, error } = await supabase
    .from('business_cards')
    .insert([{
      user_id: userId,
      name: cardData.name,
      title: cardData.title,
      phone: cardData.phone,
      email: cardData.email,
      instagram: cardData.instagram,
      blog: cardData.blog,
      image: cardData.image,
      theme: cardData.theme,
      layout: cardData.layout,
      image_gradient: cardData.imageGradient || false,
    }])
    .select()
    .single();

  return { data, error };
};

export const updateCard = async (cardId, cardData) => {
  const { data, error } = await supabase
    .from('business_cards')
    .update({
      name: cardData.name,
      title: cardData.title,
      phone: cardData.phone,
      email: cardData.email,
      instagram: cardData.instagram,
      blog: cardData.blog,
      image: cardData.image,
      theme: cardData.theme,
      layout: cardData.layout,
      image_gradient: cardData.imageGradient || false,
    })
    .eq('id', cardId)
    .select()
    .single();

  return { data, error };
};

export const getUserCards = async (userId) => {
  const { data, error } = await supabase
    .from('business_cards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const deleteCard = async (cardId) => {
  const { error } = await supabase
    .from('business_cards')
    .delete()
    .eq('id', cardId);

  return { error };
};
