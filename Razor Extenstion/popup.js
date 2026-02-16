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

// ---- FIELD MAPPINGS ----
const FIELDS = [
  { label: "Condition", id: "Condition", selector: "#ac_Condition" },
  { label: "Location", id: "Location", selector: "#ac_Location" },
  { label: "Category", id: "Category", selector: "#ac_Category" },
  { label: "Notes", id: "Notes", selector: 'textarea[name="Notes"]' },
  {
    label: "Next Step",
    id: "NextStep",
    selector: "#dd_AssetWorkflowSteps",
    isDropdown: true,
    options: [
      { label: "Data Collection", value: "0" },
      { label: "Data Destruction", value: "1" },
      { label: "Resale", value: "102" },
      { label: "Scrap", value: "103" },
    ],
  },
  { label: "Packaging", id: "PACKAGING", selector: "#ac_PACKAGING" },
  { label: "Description", id: "Description", selector: "#ac_Description" },
  { label: "Weight", id: "Weight", selector: 'input[name="Weight"]' },
  {
    label: "Form Factor",
    id: "FormFactor",
    selector: "#ac_HardDrive__FormFactor",
  },
  { label: "CPU Type", id: "CPUType", selector: "#ac_CPUType" },
  { label: "CPU Speed", id: "CPUSpeed", selector: "#ac_CPUSpeed" },
  { label: "CPU Cores", id: "CPUCores", selector: "#ac_CPUCores" },
  { label: "Memory", id: "Memory", selector: "#ac_Memory" },
  { label: "Memory Speed", id: "MemorySpeed", selector: "#ac_MemorySpeed" },
  {
    label: "Memory Config",
    id: "MemoryConfiguration",
    selector: "#ac_MemoryConfiguration",
  },
  { label: "HDD Qty", id: "HDDQty", selector: "#ac_HDDQty" },
  { label: "HDD Model", id: "HardDriveModel", selector: "#ac_HardDriveModel" },
  {
    label: "HDD Serial",
    id: "HardDriveSerial",
    selector: "#ac_HardDriveSerial",
  },
  { label: "HDD Type", id: "HDDType", selector: "#ac_HDDType" },
  {
    label: "Storage Medium",
    id: "StorageMedium",
    selector: "#ac_StorageMedium",
  },
  { label: "HDD Size", id: "HDDSize", selector: "#ac_HDDSize" },
  { label: "HDD Caddie", id: "HDDCaddie", selector: "#ac_HDDCaddie" },
  { label: "HDD Removed", id: "HDDRemoved", selector: "#ac_HDDRemoved" },
  {
    label: "Erasure Method",
    id: "ErasureMethod",
    selector: "#ac_ErasureMethod",
  },
  {
    label: "Erasure Results",
    id: "ErasureResults",
    selector: "#ac_ErasureResults",
  },
  { label: "Erasure Date", id: "ErasureDate", selector: "#ac_ErasureDate" },
  {
    label: "Drive Shredded",
    id: "DriveShredded",
    selector: "#ac_DriveShredded",
  },
  { label: "Optical Drive", id: "OpticalDrive", selector: "#ac_OpticalDrive" },
  {
    label: "Fingerprint Sens",
    id: "FingerprintSens",
    selector: "#ac_FingerprintSens",
  },
  { label: "NIC", id: "NIC", selector: "#ac_NIC" },
  { label: "Video Adapter", id: "VideoAdapter", selector: "#ac_VideoAdapter" },
  { label: "Webcam", id: "Webcam", selector: "#ac_Webcam" },
  { label: "WiFi", id: "WIFI", selector: "#ac_WIFI" },
  { label: "Ext Ports", id: "ExtPorts", selector: "#ac_ExtPorts" },
  { label: "Battery Type", id: "BatteryType", selector: "#ac_BatteryType" },
  { label: "Battery Life", id: "BatteryLife", selector: "#ac_BatteryLife" },
  {
    label: "Screen Resolution",
    id: "ScreenResolution",
    selector: "#ac_ScreenResolution",
  },
  { label: "Screen Size", id: "ScreenSize", selector: "#ac_ScreenSize" },
  { label: "Touch Screen", id: "TouchScreen", selector: "#ac_TouchScreen" },
  { label: "COA", id: "COA", selector: "#ac_COA" },
  { label: "Pass or Fail", id: "PassorFail", selector: "#ac_PassorFail" },
  { label: "Grade", id: "Grade", selector: "#ac_Grade" },
  { label: "Fail Reason", id: "FailReason", selector: "#ac_FailReason" },
  { label: "Repaired", id: "Repaired", selector: "#ac_Repaired" },
  { label: "Final Grade", id: "FinalGrade", selector: "#ac_FinalGrade" },
  {
    label: "CPU Test Results",
    id: "CPUTestResults",
    selector: "#ac_CPUTestResults",
  },
  {
    label: "Memory Test Results",
    id: "MemoryTestResults",
    selector: "#ac_MemoryTestResults",
  },
  {
    label: "MB Test Results",
    id: "MBTestResults",
    selector: "#ac_MBTestResults",
  },
  {
    label: "LCD Test Results",
    id: "LCDTestResults",
    selector: "#ac_LCDTestResults",
  },
  {
    label: "KB Test Results",
    id: "KBTestResults",
    selector: "#ac_KBTestResults",
  },
];

// ---- PRESETS ----
const PRESETS = {
  gradeD_noHDD: {
    Condition: "SCRAP",
    Notes: "MISSING HARD DRIVE",
    NextStep: "102", // Resale
    PACKAGING: "SINGLE",
    // Form Factor and WiFi will be determined by reading Category
    CPUType: "N/A",
    CPUSpeed: "N/A",
    CPUCores: "N/A",
    Memory: "N/A",
    MemorySpeed: "N/A",
    MemoryConfiguration: "N/A",
    HDDQty: "0",
    HardDriveModel: "N/A",
    HardDriveSerial: "N/A",
    HDDType: "N/A",
    StorageMedium: "N/A",
    HDDSize: "N/A",
    HDDCaddie: "N/A",
    HDDRemoved: "NO",
    ErasureMethod: "N/A",
    ErasureResults: "N/A",
    ErasureDate: "N/A",
    DriveShredded: "NO",
    OpticalDrive: "N/A",
    NIC: "N/A",
    VideoAdapter: "N/A",
    Webcam: "Camera",
    // WiFi determined by category
    PassorFail: "FAIL",
    Grade: "D",
    FailReason: "NO POWER",
    Repaired: "NO",
    FinalGrade: "D",
    CPUTestResults: "N/A",
    MemoryTestResults: "N/A",
    MBTestResults: "N/A",
    LCDTestResults: "N/A",
    KBTestResults: "N/A",
  },

  gradeF_noHDD: {
    Condition: "SCRAP",
    Notes: "MISSING HARD DRIVE",
    NextStep: "102", // Resale
    PACKAGING: "SINGLE",
    FormFactor: "LAPTOP", // Always Laptop for Grade F
    CPUType: "N/A",
    CPUSpeed: "N/A",
    CPUCores: "N/A",
    Memory: "N/A",
    MemorySpeed: "N/A",
    MemoryConfiguration: "N/A",
    HDDQty: "0",
    HardDriveModel: "N/A",
    HardDriveSerial: "N/A",
    HDDType: "N/A",
    StorageMedium: "N/A",
    HDDSize: "N/A",
    HDDCaddie: "N/A",
    HDDRemoved: "NO",
    ErasureMethod: "N/A",
    ErasureResults: "N/A",
    ErasureDate: "N/A",
    DriveShredded: "NO",
    OpticalDrive: "N/A",
    NIC: "N/A",
    VideoAdapter: "N/A",
    Webcam: "Camera",
    WIFI: "YES", // Always Yes for Laptop
    PassorFail: "FAIL",
    Grade: "F",
    FailReason: "CRACKED SCREEN",
    Repaired: "NO",
    FinalGrade: "F",
    CPUTestResults: "N/A",
    MemoryTestResults: "N/A",
    MBTestResults: "N/A",
    LCDTestResults: "N/A",
    KBTestResults: "N/A",
  },

  gradeD_yesHDD: {
    Condition: "SCRAP",
    NextStep: "102", // Resale
    PACKAGING: "SINGLE",
    // Form Factor and WiFi will be determined by reading Category
    CPUType: "N/A",
    CPUSpeed: "N/A",
    CPUCores: "N/A",
    Memory: "N/A",
    MemorySpeed: "N/A",
    MemoryConfiguration: "N/A",
    HDDRemoved: "YES",
    ErasureMethod: "N/A",
    ErasureResults: "N/A",
    ErasureDate: "N/A",
    OpticalDrive: "N/A",
    NIC: "N/A",
    VideoAdapter: "N/A",
    Webcam: "Camera",
    // WiFi determined by category
    PassorFail: "FAIL",
    Grade: "D",
    FailReason: "NO POWER",
    Repaired: "NO",
    FinalGrade: "D",
    CPUTestResults: "N/A",
    MemoryTestResults: "N/A",
    MBTestResults: "N/A",
    LCDTestResults: "N/A",
    KBTestResults: "N/A",
  },

  gradeF_yesHDD: {
    Condition: "SCRAP",
    NextStep: "102", // Resale
    PACKAGING: "SINGLE",
    FormFactor: "LAPTOP", // Always Laptop for Grade F
    CPUType: "N/A",
    CPUSpeed: "N/A",
    CPUCores: "N/A",
    Memory: "N/A",
    MemorySpeed: "N/A",
    MemoryConfiguration: "N/A",
    HDDRemoved: "YES",
    ErasureMethod: "N/A",
    ErasureResults: "N/A",
    ErasureDate: "N/A",
    OpticalDrive: "N/A",
    NIC: "N/A",
    VideoAdapter: "N/A",
    Webcam: "Camera",
    WIFI: "YES", // Always Yes for Laptop
    PassorFail: "FAIL",
    Grade: "F",
    FailReason: "CRACKED SCREEN",
    Repaired: "NO",
    FinalGrade: "F",
    CPUTestResults: "N/A",
    MemoryTestResults: "N/A",
    MBTestResults: "N/A",
    LCDTestResults: "N/A",
    KBTestResults: "N/A",
  },
};

// ---- INIT ----
document.addEventListener("DOMContentLoaded", init);

function init() {
  buildForm();
  loadSavedTemplate();
  setupEventListeners();
  setupSettingsListeners();
  loadSettings();
  setupAuthListeners();
  loadAuthState();
  setupCreateLotListeners();
}

// ---- BUILD FORM ----
function buildForm() {
  const container = document.getElementById("form-fields");
  if (!container) return;
  container.innerHTML = "";
  FIELDS.forEach((field) => {
    // Skip Final Grade field in custom template (auto-filled from Grade)
    if (field.id === "FinalGrade") {
      return;
    }

    const row = document.createElement("div");
    row.className = "form-row";

    if (field.isDropdown && field.options) {
      // Create dropdown select for dropdown fields
      const selectOptions = field.options
        .map((opt) => {
          // Handle both string options and {label, value} objects
          if (typeof opt === "string") {
            return `<option value="${opt}">${opt}</option>`;
          } else {
            return `<option value="${opt.value}">${opt.label}</option>`;
          }
        })
        .join("");
      row.innerHTML = `
        <label>${field.label}:</label>
        <select id="field_${field.id}">
          <option value="">-- Select --</option>
          ${selectOptions}
        </select>
      `;
    } else {
      // Create text input for regular fields
      row.innerHTML = `
        <label>${field.label}:</label>
        <input type="text" id="field_${field.id}" placeholder="">
      `;
    }
    container.appendChild(row);
  });
}

// ---- LOAD / SAVE ----
function loadSavedTemplate() {
  safeChrome.storage.local.get(["saved_template"], (result) => {
    if (result.saved_template) fillFormInputs(result.saved_template);
  });
}

function fillFormInputs(data) {
  Object.keys(data).forEach((key) => {
    // Skip Final Grade - it's auto-copied from Grade, no input field
    if (key === "FinalGrade") {
      console.log(
        "Skipping Final Grade in UI (will be auto-copied from Grade)",
      );
      return;
    }
    const input = document.getElementById(`field_${key}`);
    if (input) input.value = data[key] || "";
  });
}

// ---- EVENT LISTENERS ----
function setupEventListeners() {
  console.log("Setting up event listeners");

  // Presets - pass isPreset=true
  const presetButtons = document.querySelectorAll("[data-preset]");
  console.log("Found preset buttons:", presetButtons.length);
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Preset clicked:", btn.dataset.preset);
      const preset = PRESETS[btn.dataset.preset];
      fillAndSubmit(preset, true); // TRUE = this is a preset button
    });
  });

  // Save / Fill / Clear
  const actionButtons = document.querySelectorAll("[data-action]");
  console.log("Found action buttons:", actionButtons.length);
  actionButtons.forEach((btn) => {
    console.log("Registering button:", btn.dataset.action, btn.textContent);
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      console.log("Action button clicked:", action);
      if (action === "save") saveTemplate();
      else if (action === "fill")
        fillCustomTemplate(); // fillCustomTemplate calls with isPreset=false
      else if (action === "clear") clearTemplate();
    });
  });
}

// ---- ACTIONS ----
function saveTemplate() {
  const data = {};
  FIELDS.forEach((field) => {
    const input = document.getElementById(`field_${field.id}`);
    if (input && input.value.trim()) {
      data[field.id] = input.value.trim();
    }
  });

  // ALWAYS force Final Grade to match Grade (override any existing value)
  if (data.Grade) {
    data.FinalGrade = data.Grade;
  }

  if (Object.keys(data).length === 0) {
    showStatus("âš  No fields filled to save", true);
    return;
  }

  safeChrome.storage.local.set({ saved_template: data }, () => {
    if (chrome.runtime.lastError) {
      showStatus("Error saving: " + chrome.runtime.lastError.message, true);
    } else {
      showStatus("âœ“ Template saved!");
    }
  });
}

async function fillCustomTemplate() {
  const data = {};
  FIELDS.forEach((field) => {
    const input = document.getElementById(`field_${field.id}`);
    if (input && input.value.trim()) {
      data[field.id] = input.value.trim();
    }
  });

  // ALWAYS force Final Grade to match Grade (override any existing value)
  if (data.Grade) {
    data.FinalGrade = data.Grade;
  }

  if (Object.keys(data).length === 0) {
    showStatus("âš  No fields filled to submit", true);
    return;
  }

  await fillAndSubmit(data, false); // FALSE = this is custom template, no auto-detection
}

function clearTemplate() {
  FIELDS.forEach((field) => {
    const input = document.getElementById(`field_${field.id}`);
    if (input) input.value = "";
  });
  safeChrome.storage.local.remove(["saved_template"]);
  showStatus("âœ“ Template cleared!");
}

// ---- PAGE INJECTION ----
async function fillAndSubmit(data, isPreset = false) {
  try {
    const [tab] = await safeChrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      showStatus("âŒ No active tab found", true);
      return;
    }

    if (!tab.id) {
      showStatus("âŒ Invalid tab ID", true);
      return;
    }

    if (!safeChrome.scripting || !safeChrome.scripting.executeScript) {
      showStatus("âŒ Extension scripting API not available", true);
      return;
    }

    const results = await safeChrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (fieldMappings, formData, isPreset) => {
        // Read Grade from the page (it's already filled manually)
        const gradeElement = document.querySelector("#ac_Grade");
        const currentGrade = gradeElement ? gradeElement.value : null;

        let isLaptop = true; // Default to Laptop
        let deviceType = "UNKNOWN";

        // Only read Category and auto-set Form Factor/WiFi for PRESET buttons
        if (isPreset) {
          // Read Category field to determine Desktop or Laptop
          const categoryElement = document.querySelector("#ac_Category");
          const categoryValue = categoryElement ? categoryElement.value : "";

          // Determine if Desktop or Laptop
          if (categoryValue.includes("Desktops")) {
            isLaptop = false;
          }
          deviceType = isLaptop ? "LAPTOP" : "DESKTOP";

          // Auto-set Form Factor and WiFi if not already set (for Grade D presets)
          if (!formData.FormFactor) {
            formData.FormFactor = isLaptop ? "LAPTOP" : "DESKTOP";
          }
          if (!formData.WIFI) {
            formData.WIFI = isLaptop ? "YES" : "NO";
          }
        }

        // Copy Grade from page to Final Grade
        if (currentGrade) {
          formData.FinalGrade = currentGrade;
        }

        // Fields that don't exist on Desktop
        const desktopSkipFields = [
          "BatteryType",
          "BatteryLife",
          "ScreenResolution",
          "ScreenSize",
          "TouchScreen",
          "FingerprintSens",
          "LCDTestResults",
          "KBTestResults",
        ];

        let filledCount = 0;
        const results = [];

        fieldMappings.forEach((field) => {
          // Skip Desktop-only fields if this is a Desktop (only for presets)
          if (isPreset && !isLaptop && desktopSkipFields.includes(field.id)) {
            return;
          }

          // Only fill fields that have values in formData
          if (formData[field.id]) {
            const el = document.querySelector(field.selector);
            if (el) {
              // Set the value
              el.value = formData[field.id];

              // For dropdowns, also try to select by text if value doesn't work
              if (field.isDropdown && el.tagName === "SELECT") {
                const options = Array.from(el.options);
                const matchingOption = options.find(
                  (opt) =>
                    opt.value === formData[field.id] ||
                    opt.text === formData[field.id],
                );
                if (matchingOption) {
                  el.selectedIndex = matchingOption.index;
                }
              }

              // Trigger multiple events for autocomplete fields
              el.dispatchEvent(new Event("input", { bubbles: true }));
              el.dispatchEvent(new Event("change", { bubbles: true }));
              el.dispatchEvent(new Event("blur", { bubbles: true }));

              // For autocomplete fields, also trigger keyup and keydown
              if (el.classList.contains("ui-autocomplete-input")) {
                el.dispatchEvent(
                  new KeyboardEvent("keydown", { bubbles: true }),
                );
                el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
              }

              filledCount++;
              results.push({
                field: field.id,
                success: true,
                value: formData[field.id],
              });
            } else {
              results.push({
                field: field.id,
                success: false,
                reason: "not found",
              });
            }
          }
        });
        return {
          success: true,
          filledCount: filledCount,
          details: results,
          deviceType: isPreset ? deviceType : "CUSTOM",
        };
      },
      args: [FIELDS, data, isPreset],
    });

    if (results && results[0] && results[0].result) {
      const { filledCount, deviceType } = results[0].result;
      if (deviceType === "CUSTOM") {
        showStatus(`âœ“ Filled ${filledCount} field(s)!`);
      } else {
        showStatus(`âœ“ Filled ${filledCount} field(s) for ${deviceType}!`);
      }
    } else {
      showStatus("âœ“ Form filled successfully!");
    }
  } catch (err) {
    showStatus("Error: " + err.message, true);
  }
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

    const lotPagePattern =
      /^https:\/\/secureitad\.razorerp\.com\/recycling\?.*lotId=/;
    if (!lotPagePattern.test(tab.url)) {
      showCreateLotStatus("Navigate to a Razor ERP lot page first", true);
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
