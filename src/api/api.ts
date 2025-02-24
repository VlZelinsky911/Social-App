import { supabase } from "../supabase/supabaseClient";

interface Post {
  text: string;
  mediaUrls?: string[];
}


export const createPost = async (post: Post) => {
  const { data, error } = await supabase.from("posts").insert([post]);

  if (error) {
    console.error("Помилка при збереженні поста:", error);
    throw error;
  }

  return data;
};


export const uploadFile = async (file: File): Promise<string | null> => {
  const filePath = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from("post-media").upload(filePath, file);

  if (error) {
    console.error("Помилка при завантаженні файлу:", error);
    return null;
  }


  const { data: publicUrlData } = supabase.storage.from("post-media").getPublicUrl(filePath);
  return publicUrlData.publicUrl;
};
