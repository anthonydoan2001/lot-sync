// ---- SAFE CHROME STORAGE FALLBACK ----
const safeChrome =
  typeof chrome !== "undefined" && chrome.storage
    ? chrome
    : {
        storage: {
          local: {
            get: (_, cb) => cb && cb({}),
            set: (_, cb) => cb && cb(),
            remove: (_, cb) => cb && cb(),
          },
        },
        tabs: { query: async () => [] },
        scripting: { executeScript: async () => {} },
      };

// ---- INIT ----
document.addEventListener("DOMContentLoaded", init);

function init() {
  setupSettingsListeners();
  loadSettings();
  setupAuthListeners();
  loadAuthState();
  setupCreateLotListeners();
}

// ---- HELPERS ----
function showStatus(message, isError = false) {
  const status = document.getElementById("status");
  if (!status) return;
  status.textContent = message;
  status.style.background = isError ? "#ffebee" : "#e8f5e9";
  status.style.color = isError ? "#c62828" : "#2e7d32";
  status.classList.add("show");
  setTimeout(() => status.classList.remove("show"), 3000);
}

// ---- SETTINGS MODULE ----
function setupSettingsListeners() {
  const toggle = document.getElementById("settingsToggle");
  const saveBtn = document.getElementById("saveSettingsBtn");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const section = document.getElementById("settingsSection");
      if (section) section.classList.toggle("show");
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener("click", saveSettings);
  }
}

function loadSettings(callback) {
  safeChrome.storage.local.get(["supabaseUrl", "supabaseAnonKey"], (result) => {
    const urlInput = document.getElementById("supabaseUrl");
    const keyInput = document.getElementById("supabaseAnonKey");
    if (urlInput && result.supabaseUrl) urlInput.value = result.supabaseUrl;
    if (keyInput && result.supabaseAnonKey)
      keyInput.value = result.supabaseAnonKey;
    if (callback) callback(result);
  });
}

function saveSettings() {
  const urlInput = document.getElementById("supabaseUrl");
  const keyInput = document.getElementById("supabaseAnonKey");
  if (!urlInput || !keyInput) return;

  const url = urlInput.value.trim().replace(/\/+$/, "");
  const key = keyInput.value.trim();

  if (!url || !key) {
    showStatus("Please fill in both Supabase URL and Anon Key", true);
    return;
  }

  try {
    new URL(url);
  } catch {
    showStatus("Invalid Supabase URL", true);
    return;
  }

  safeChrome.storage.local.set(
    { supabaseUrl: url, supabaseAnonKey: key },
    () => {
      urlInput.value = url;
      const saved = document.getElementById("settingsSaved");
      if (saved) {
        saved.style.display = "inline";
        setTimeout(() => (saved.style.display = "none"), 2000);
      }
    },
  );
}

function getSettings() {
  return new Promise((resolve) => {
    safeChrome.storage.local.get(
      ["supabaseUrl", "supabaseAnonKey"],
      (result) => {
        resolve({
          supabaseUrl: result.supabaseUrl || "",
          anonKey: result.supabaseAnonKey || "",
        });
      },
    );
  });
}

// ---- AUTH MODULE ----
function setupAuthListeners() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const passwordInput = document.getElementById("authPassword");

  if (loginBtn) loginBtn.addEventListener("click", handleLogin);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (passwordInput) {
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }
}

function loadAuthState() {
  safeChrome.storage.local.get(
    [
      "authAccessToken",
      "authRefreshToken",
      "authDisplayName",
      "authUserId",
      "authExpiresAt",
    ],
    (result) => {
      if (result.authAccessToken && result.authDisplayName) {
        updateAuthUI(true, result.authDisplayName);
      } else {
        updateAuthUI(false, null);
      }
    },
  );
}

function updateAuthUI(isLoggedIn, displayName) {
  const loggedOut = document.getElementById("authLoggedOut");
  const loggedIn = document.getElementById("authLoggedIn");
  const nameDisplay = document.getElementById("authDisplayName");
  const createLotSection = document.getElementById("createLotSection");

  if (isLoggedIn) {
    if (loggedOut) loggedOut.style.display = "none";
    if (loggedIn) loggedIn.style.display = "block";
    if (nameDisplay) nameDisplay.textContent = displayName;
    if (createLotSection) createLotSection.style.display = "block";
  } else {
    if (loggedOut) loggedOut.style.display = "block";
    if (loggedIn) loggedIn.style.display = "none";
    if (nameDisplay) nameDisplay.textContent = "";
    if (createLotSection) createLotSection.style.display = "none";
  }
}

async function handleLogin() {
  const usernameInput = document.getElementById("authUsername");
  const passwordInput = document.getElementById("authPassword");
  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showStatus("Please enter username and password", true);
    return;
  }

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    showStatus(
      "Username must be 3-20 chars (letters, numbers, underscores)",
      true,
    );
    return;
  }

  const email = `${username.toLowerCase()}@lotsync.app`;

  const { supabaseUrl, anonKey } = await getSettings();
  if (!supabaseUrl || !anonKey) {
    showStatus("Configure Supabase settings first", true);
    return;
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
        },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error_description || err.msg || "Login failed");
    }

    const data = await res.json();
    const expiresAt = Date.now() + data.expires_in * 1000;

    // Fetch user ID
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    let userId = null;
    let displayName = username;
    if (userRes.ok) {
      const userData = await userRes.json();
      userId = userData.id;

      // Fetch profile for display name
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=display_name`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      );
      if (profileRes.ok) {
        const profiles = await profileRes.json();
        if (profiles.length > 0) {
          displayName = profiles[0].display_name;
        }
      }
    }

    safeChrome.storage.local.set(
      {
        authAccessToken: data.access_token,
        authRefreshToken: data.refresh_token,
        authDisplayName: displayName,
        authUserId: userId,
        authExpiresAt: expiresAt,
      },
      () => {
        passwordInput.value = "";
        updateAuthUI(true, displayName);
        showStatus("Logged in!");
      },
    );
  } catch (err) {
    passwordInput.value = "";
    showStatus("Login error: " + err.message, true);
  }
}

function handleLogout() {
  safeChrome.storage.local.remove(
    [
      "authAccessToken",
      "authRefreshToken",
      "authDisplayName",
      "authUserId",
      "authExpiresAt",
    ],
    () => {
      updateAuthUI(false, null);
      showStatus("Logged out");
    },
  );
}

function getValidToken() {
  return new Promise((resolve) => {
    safeChrome.storage.local.get(
      ["authAccessToken", "authRefreshToken", "authExpiresAt"],
      async (result) => {
        if (!result.authAccessToken) {
          resolve(null);
          return;
        }

        // If token expires within 60 seconds, refresh it
        if (result.authExpiresAt && Date.now() > result.authExpiresAt - 60000) {
          try {
            const { supabaseUrl, anonKey } = await getSettings();
            const res = await fetch(
              `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: anonKey,
                },
                body: JSON.stringify({
                  refresh_token: result.authRefreshToken,
                }),
              },
            );

            if (!res.ok) {
              handleLogout();
              resolve(null);
              return;
            }

            const data = await res.json();
            const expiresAt = Date.now() + data.expires_in * 1000;

            safeChrome.storage.local.set({
              authAccessToken: data.access_token,
              authRefreshToken: data.refresh_token,
              authExpiresAt: expiresAt,
            });
            resolve(data.access_token);
          } catch {
            handleLogout();
            resolve(null);
          }
        } else {
          resolve(result.authAccessToken);
        }
      },
    );
  });
}

// ---- CREATE LOT MODULE ----
function setupCreateLotListeners() {
  const btn = document.getElementById("createLotBtn");
  if (btn) btn.addEventListener("click", handleCreateLot);
}

function showCreateLotStatus(message, isError = false) {
  const el = document.getElementById("createLotStatus");
  if (!el) return;
  el.textContent = message;
  el.style.background = isError ? "#ffebee" : "#e8f5e9";
  el.style.color = isError ? "#c62828" : "#2e7d32";
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 5000);
}

async function handleCreateLot() {
  const btn = document.getElementById("createLotBtn");
  const originalText = btn ? btn.textContent : "";

  try {
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Scraping page...";
    }

    const token = await getValidToken();
    if (!token) {
      showCreateLotStatus("Not authenticated. Please log in.", true);
      return;
    }

    const { supabaseUrl, anonKey } = await getSettings();
    if (!supabaseUrl || !anonKey) {
      showCreateLotStatus("Configure Supabase settings first", true);
      return;
    }

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.url) {
      showCreateLotStatus("No active tab found", true);
      return;
    }

    if (!tab.url.includes("razorerp.com")) {
      showCreateLotStatus("Navigate to a Razor ERP page first", true);
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const header = document.querySelector("div.page-aside-header");
        const headerText = header ? header.textContent : "";

        // Extract lot number
        const lotMatch = headerText.match(/Lot:\s*(\d+)/);
        let lotNumber = lotMatch ? lotMatch[1] : null;
        if (!lotNumber) {
          const urlParams = new URLSearchParams(window.location.search);
          lotNumber = urlParams.get("lotId") || null;
        }

        // Extract contents (text after "Lot: NNNN ")
        let contents = "UNKNOWN";
        const contentsMatch = headerText.match(/Lot:\s*\d+\s+(.+)/);
        if (contentsMatch) {
          contents = contentsMatch[1].trim();
        }

        // Extract IO from first col-sm-7 in the audit form
        let io = null;
        const auditForm = document.querySelector("form.form-horizontal.audit");
        if (auditForm) {
          const ioElement = auditForm.querySelector("div.col-sm-7");
          if (ioElement) {
            const ioText = ioElement.textContent.trim();
            io = ioText.replace(/^IO-/, "");
          }
        }

        return { lotNumber, contents, io };
      },
    });

    if (!results || !results[0] || !results[0].result) {
      showCreateLotStatus("Failed to scrape page data", true);
      return;
    }

    const { lotNumber, contents, io } = results[0].result;
    if (!lotNumber || !/^\d+$/.test(lotNumber)) {
      showCreateLotStatus("Could not find a valid lot number on page", true);
      return;
    }

    const sanitizedContents = (contents || "UNKNOWN").trim().slice(0, 500);

    // Get user ID from storage
    const userId = await new Promise((resolve) => {
      safeChrome.storage.local.get(["authUserId"], (r) =>
        resolve(r.authUserId),
      );
    });

    // Check if lot already exists
    if (btn) btn.textContent = "Checking lot...";

    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/lots?lot_number=eq.${encodeURIComponent(lotNumber)}&select=id`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let lotId = null;
    let isNewLot = false;

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing.length > 0) {
        // Lot exists - just join it
        lotId = existing[0].id;
      }
    }

    if (!lotId) {
      // Insert new lot
      if (btn) btn.textContent = "Creating lot...";

      const body = {
        lot_number: lotNumber,
        contents: sanitizedContents,
        is_retired: false,
      };
      if (io) body.io = io;

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/lots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(body),
      });

      if (!insertRes.ok) {
        if (insertRes.status === 409) {
          showCreateLotStatus(
            `Lot ${lotNumber} already exists but could not be fetched`,
            true,
          );
          return;
        }
        if (insertRes.status === 403) {
          showCreateLotStatus("Permission denied", true);
          return;
        }
        throw new Error("Failed to create lot");
      }

      const insertedRows = await insertRes.json();
      if (insertedRows.length > 0) {
        lotId = insertedRows[0].id;
      }
      isNewLot = true;
    }

    // Join the lot as a worker
    if (lotId && userId) {
      if (btn) btn.textContent = "Joining lot...";

      const joinRes = await fetch(`${supabaseUrl}/rest/v1/lot_workers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ lot_id: lotId, user_id: userId }),
      });

      // 409 = already joined, that's fine
      if (!joinRes.ok && joinRes.status !== 409) {
        console.warn("Failed to join lot as worker:", joinRes.status);
      }
    }

    if (isNewLot) {
      showCreateLotStatus(`Lot ${lotNumber} created & joined!`);
    } else {
      showCreateLotStatus(`Joined lot ${lotNumber}!`);
    }
  } catch (err) {
    showCreateLotStatus("Error: " + err.message, true);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}