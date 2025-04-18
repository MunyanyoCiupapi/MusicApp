document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    if (!form) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const isRegistering = formData.has("email");
  
      const data = {
        username: formData.get("username"),
        password: formData.get("password"),
      };
  
      if (isRegistering) {
        data.email = formData.get("email");
      }
  
      try {
        const endpoint = isRegistering ? "/register" : "/login";
  
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        const message = await response.json();
  
        if (response.ok) {
          showToast(message.message, "success");
          setTimeout(() => {
            window.location.href = isRegistering ? "login.html" : "index.html";
          }, 2000);
        } else {
          showToast(message.message, "error");
        }
      } catch (err) {
        showToast("err: " + err.message, "error");
      }
    });
  });
  
  function showToast(message, type) {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;
  
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 5000);
  }
  