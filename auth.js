import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("authForm");
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const submitBtn = document.getElementById("submitBtn");

  if (!authForm) return;

  authForm.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const isRegister = registerTab?.classList.contains("active");
      const email = document.getElementById("authEmail")?.value.trim();
      const password = document.getElementById("authPassword")?.value.trim();
      const name = document.getElementById("authName")?.value.trim();

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = isRegister ? "Creating account..." : "Logging in...";

      try {
        if (isRegister) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name || email.split("@")[0],
              },
            },
          });

          if (error) throw error;

          localStorage.setItem(
            "stockpulse-user",
            JSON.stringify({
              name: name || email.split("@")[0],
              email,
            })
          );

          alert("Account created. Please check your email if confirmation is enabled.");
          window.location.href = "index.html";
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert("Wrong email or password, or this account does not exist.");
          return;
        }

        const user = data.user;

        localStorage.setItem(
          "stockpulse-user",
          JSON.stringify({
            name: user.user_metadata?.name || user.email.split("@")[0],
            email: user.email,
          })
        );

        window.location.href = "index.html";
      } catch (err) {
        alert(err.message || "Authentication failed.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isRegister ? "Create Account" : "Log in";
      }
    },
    true
  );
});
