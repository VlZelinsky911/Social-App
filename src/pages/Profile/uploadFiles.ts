import { supabase, supabaseUrl } from "../../services/supabaseClient";

export const uploadFiles = async (selectedFiles: File[], bucket: string): Promise<string[]> => {
  if (selectedFiles.length === 0) {
    console.warn("⚠ Немає файлів для завантаження!");
    return [];
  }

  const uploadedUrls: string[] = [];

  for (const file of selectedFiles) {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });

    if (error) {
      console.error(`❌ Помилка завантаження ${file.name}:`, error);
      continue;
    }

    const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
    console.log(`✅ Файл завантажено: ${fileUrl}`);
    uploadedUrls.push(fileUrl);
  }

  return uploadedUrls;
};
