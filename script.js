document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const authForm = document.getElementById("authForm");
  const nameGroup = document.getElementById("nameGroup");
  const submitBtn = document.getElementById("submitBtn");
  const loginMeta = document.getElementById("loginMeta");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const stocksGrid = document.getElementById("stocksGrid");
  const newsList = document.getElementById("newsList");
  const currencySelect = document.getElementById("currencySelect");
  const searchInput = document.querySelector(".market-search");
  document.querySelectorAll(".clean-back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.history.back();
  });
});

  const routeMap = {
    home: "index.html",
    markets: "market.html",
    portfolio: "portfolio.html",
    profile: "profile.html",
    detail: "detail.html",
    pro: "pro.html",
  };

  const go = (key) => {
    const target = routeMap[key];
    if (target) window.location.href = target;
  };

  const getSavedUser = () => {
    try {
      return JSON.parse(localStorage.getItem("stockpulse-user") || "null");
    } catch {
      return null;
    }
  };

  const getInitials = (value) => {
    const text = String(value || "User").trim();

    if (text.includes("@")) {
      return text[0].toUpperCase();
    }

    return (
      text
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  };

  const applyUserToPage = () => {
  const savedUser = getSavedUser();

  if (!savedUser) return;

  const displayName = savedUser.name || savedUser.email?.split("@")[0] || "User";
  const email = savedUser.email || "";
  const initials = getInitials(displayName);

  document.querySelectorAll(".hero-name").forEach((el) => {
    el.textContent = displayName;
  });

  document.querySelectorAll(".avatar-circle").forEach((el) => {
    el.textContent = initials;
  });

  document.querySelectorAll("h1, h2, h3, p, span, div, strong").forEach((el) => {
    const text = el.textContent.trim();

    if (text === "Mary Sims") {
      el.textContent = displayName;
    }

    if (text === "mary.sims@email.com") {
      el.textContent = email;
    }

    if (text === "MS") {
      el.textContent = initials;
    }
  });
};

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("stockpulse-user");
      sessionStorage.clear();
      window.location.href = "auth.html";
    });
  }

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const key = el.dataset.nav;
      if (routeMap[key]) {
        e.preventDefault();
        go(key);
      }
    });
  });

  document.querySelectorAll("[data-link='detail']").forEach((item) => {
    item.style.cursor = "pointer";

    item.addEventListener("click", () => {
      const symbol =
        item.dataset.symbol ||
        item.querySelector("strong")?.textContent?.trim() ||
        "AAPL";

      const currency = localStorage.getItem("stockpulse-currency") || "USD";

      window.location.href = `detail.html?symbol=${encodeURIComponent(
        symbol
      )}&currency=${encodeURIComponent(currency)}`;
    });
  });

  const setActiveNav = () => {
    const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    document.querySelectorAll("[data-nav]").forEach((el) => {
      const key = el.dataset.nav;
      const href = routeMap[key];
      el.classList.toggle("active", href && href.toLowerCase() === current);
    });
  };

  setActiveNav();

  const applyTheme = (theme) => {
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(theme);
    if (themeToggle) themeToggle.textContent = theme === "theme-dark" ? "Sun" : "Moon";
  };

  applyTheme(localStorage.getItem("stockpulse-theme") || "theme-dark");

  themeToggle?.addEventListener("click", () => {
    const next = body.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
    applyTheme(next);
    localStorage.setItem("stockpulse-theme", next);
  });

  const setMode = (mode) => {
    const isRegister = mode === "register";

    loginTab?.classList.toggle("active", !isRegister);
    registerTab?.classList.toggle("active", isRegister);
    nameGroup?.classList.toggle("d-none", !isRegister);
    loginMeta?.classList.toggle("d-none", isRegister);

    if (submitBtn) submitBtn.textContent = isRegister ? "Create Account" : "Log in";
  };

  loginTab?.addEventListener("click", () => setMode("login"));
  registerTab?.addEventListener("click", () => setMode("register"));
  setMode("login");

  authForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const isRegister = registerTab?.classList.contains("active");
    const email = document.getElementById("authEmail")?.value.trim() || "";
    const name = document.getElementById("authName")?.value.trim() || "";

    const displayName = isRegister && name ? name : email.split("@")[0] || "User";

    localStorage.setItem(
      "stockpulse-user",
      JSON.stringify({
        name: displayName,
        email,
      })
    );

    go("home");
  });

  applyUserToPage();

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const showStocks = btn.dataset.mode === "stocks";

      if (stocksGrid && newsList) {
        stocksGrid.classList.toggle("d-none", !showStocks);
        newsList.classList.toggle("d-none", showStocks);
      }
    });
  });

  const US_UNIVERSE = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "META", name: "Meta Platforms" },
    { symbol: "NVDA", name: "NVIDIA Corp." },
    { symbol: "JPM", name: "JPMorgan Chase" },
    { symbol: "BAC", name: "Bank of America" },
    { symbol: "JNJ", name: "Johnson & Johnson" },
  ];

  let currentCurrency = (localStorage.getItem("stockpulse-currency") || "USD").toUpperCase();
  let lastItems = [];

  const fmtPrice = (v, c = "USD") => {
    return v == null || Number.isNaN(Number(v)) ? "-" : `${Number(v).toFixed(2)} ${c}`;
  };

  const trendBadge = (pct = 0) => {
    const p = Number(pct || 0);

    return {
      text: `${p >= 0 ? "up" : "down"} ${p >= 0 ? "+" : ""}${p.toFixed(2)}%`,
      cls: p >= 0 ? "success" : "danger",
    };
  };

  const renderStocks = (items = [], currency = "USD") => {
    if (!stocksGrid) return;

    if (!items.length) {
      stocksGrid.innerHTML = `<div class="col-12"><div class="market-card">No companies found</div></div>`;
      return;
    }

    stocksGrid.innerHTML = items
      .map((it) => {
        const b = trendBadge(it.change_pct);
        const symbol = it.symbol || "N/A";
        const name = it.name || symbol;

        return `
          <div class="col-md-6">
            <a href="detail.html?symbol=${encodeURIComponent(symbol)}&currency=${encodeURIComponent(currency)}"
               class="market-card stock-entry text-decoration-none">
              <div class="stock-left">
                <div class="stock-icon dark">${symbol[0] || "S"}</div>
                <div>
                  <div class="stock-ticker">${symbol}</div>
                  <div class="stock-name">${name}</div>
                </div>
              </div>
              <div class="stock-right">
                <span class="trend-badge ${b.cls}">${b.text}</span>
                <div class="stock-price">${fmtPrice(it.price, currency)}</div>
              </div>
            </a>
          </div>
        `;
      })
      .join("");
  };

  const applySearchFilter = () => {
    const q = (searchInput?.value || "").trim().toLowerCase();

    if (!q) {
      renderStocks(lastItems, currentCurrency);
      return;
    }

    const filtered = lastItems.filter((it) => {
      const symbol = String(it.symbol || "").toLowerCase();
      const name = String(it.name || "").toLowerCase();
      return symbol.includes(q) || name.includes(q);
    });

    renderStocks(filtered, currentCurrency);
  };

  const loadUSMarket = async () => {
    if (!stocksGrid || !window.api) return;

    const symbols = US_UNIVERSE.map((x) => x.symbol).join(",");
    const snap = await window.api.getSnapshot({
      country: "US",
      currency: currentCurrency,
      q: symbols,
    });

    const nameMap = new Map(US_UNIVERSE.map((x) => [x.symbol, x.name]));

    lastItems = (snap.items || []).map((it) => ({
      ...it,
      name: nameMap.get(it.symbol) || it.name || it.symbol,
    }));

    applySearchFilter();
  };

  currencySelect?.addEventListener("change", async (e) => {
    currentCurrency = String(e.target.value || "USD").toUpperCase();
    localStorage.setItem("stockpulse-currency", currentCurrency);

    try {
      await loadUSMarket();
    } catch (err) {
      console.error("currency switch error:", err);
    }
  });

  searchInput?.addEventListener("input", () => {
    applySearchFilter();
  });

  const geoEl = document.getElementById("geoLabel");
  if (geoEl) geoEl.textContent = `United States - ${currentCurrency}`;

  if (currencySelect) currencySelect.value = currentCurrency;

  loadUSMarket().catch(console.error);
});
