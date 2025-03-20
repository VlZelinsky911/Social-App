import { supabase, supabaseUrl} from "../../services/supabaseClient";

export const uploadFiles = async (selectedFiles: File[], p0: string): Promise<string[]> => {
  if (selectedFiles.length === 0) {
    console.warn("⚠ Немає файлів для завантаження!");
    return [];
  }

  const uploadedUrls: string[] = [];

  for (const file of selectedFiles) {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

    const { data, error } = await supabase.storage
      .from("posts")
      .upload(fileName, file);

    if (error) {
      console.error(`❌ Помилка завантаження ${file.name}:`, error);
      continue;
    }

    const fileUrl = `${supabaseUrl}/storage/v1/object/public/posts/${fileName}`;
    console.log(`✅ Файл завантажено: ${fileUrl}`);
    uploadedUrls.push(fileUrl);
  }

  return uploadedUrls;
};
