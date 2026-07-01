import { supabase } from "./supabase-client.js";

const publicPages = ["auth.html"];
const currentPage = window.location.pathname.split("/").pop() || "index.html";

if (!publicPages.includes(currentPage)) {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    window.location.href = "auth.html";
  } else {
    const user = data.session.user;

    localStorage.setItem(
      "stockpulse-user",
      JSON.stringify({
        name: user.user_metadata?.name || user.email.split("@")[0],
        email: user.email,
      })
    );
  }
}
