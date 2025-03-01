import { supabase } from "../../services/supabaseClient";

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) return console.log("Немає refresh токену");

  const { data, error } = await supabase.auth.refreshSession({ refresh_token });

  if (error) {
    console.log("Помилка оновлення токену:", error.message);
  } else {
    if (data.session) {
      localStorage.setItem("access_token", data.session.access_token);
      localStorage.setItem("refresh_token", data.session.refresh_token);
    } else {
      console.log("Session data is null");
    }
    console.log("Токен оновлено!");
  }
};

export const logout = async (navigate: any) => {
  await supabase.auth.signOut();
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  navigate("/login");
};
