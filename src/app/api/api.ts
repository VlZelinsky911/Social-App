import { supabase } from "../../services/supabaseClient";

export const fetchUserData = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.log("Токен не знайдено, користувач не авторизований");
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .single();

  if (error) {
    console.log("Помилка отримання профілю:", error.message);
    return null;
  }

  return data;
};
