import { createClient } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

export const getLikes = async (postId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact' })
    .eq('post_id', postId);

  if (error) {
    console.error('Помилка отримання лайків:', error);
    return 0;
  }
  return data.length;
};

// Функція для додавання/видалення лайка
export const toggleLike = async (postId: string, userId: string) => {
  // Перевіряємо, чи лайк вже є
  const { data: existingLike, error } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Помилка перевірки лайка:', error);
    return;
  }

  if (existingLike) {
    // Якщо лайк існує, видаляємо його
    await supabase.from('likes').delete().match({ post_id: postId, user_id: userId });
  } else {
    // Якщо лайку ще немає, додаємо
    await supabase.from('likes').insert([{ post_id: postId, user_id: userId }]);
  }
};
