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
// Each field has a `categories` array: which template categories it appears in.
// "all" = desktop + laptop + hardDrive
const FIELDS = [
  // --- Common fields (all categories) ---
  {
    label: "Condition",
    id: "Condition",
    selector: "#ac_Condition",
    isDropdown: true,
    options: [
      { label: "SCRAP", value: "SCRAP" },
      { label: "TEST_REQUIRED", value: "TEST_REQUIRED" },
      { label: "Key Function Tested", value: "Key Function Tested" },
    ],
    categories: ["all"],
  },
  {
    label: "Location",
    id: "Location",
    selector: "#ac_Location",
    categories: ["all"],
  },
  {
    label: "Category",
    id: "Category",
    selector: "#ac_Category",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Notes",
    id: "Notes",
    selector: 'textarea[name="Notes"]',
    categories: ["all"],
  },
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
    categories: ["all"],
  },
  {
    label: "Packaging",
    id: "PACKAGING",
    selector: "#ac_PACKAGING",
    isDropdown: true,
    options: [
      { label: "SINGLE", value: "SINGLE" },
      { label: "BAG", value: "BAG" },
      { label: "BOXED", value: "BOXED" },
    ],
    categories: ["all"],
  },
  {
    label: "Description",
    id: "Description",
    selector: "#ac_Description",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Weight",
    id: "Weight",
    selector: 'input[name="Weight"]',
    categories: ["all"],
  },

  // --- Hard Drive core fields (only on hardDrive inventory detail page) ---
  {
    label: "Asset Tag",
    id: "AssetTag",
    selector: 'input[name="AssetTag"]',
    categories: ["hardDrive"],
  },

  // --- Drive / Storage fields ---
  {
    label: "Form Factor",
    id: "FormFactor",
    selector: "#ac_HardDrive__FormFactor",
    categories: ["all"],
  },
  {
    label: "MODEL",
    id: "MODEL",
    selector: "#ac_MODEL",
    categories: ["hardDrive"],
  },
  { label: "MPN", id: "MPN", selector: "#ac_MPN", categories: ["hardDrive"] },
  {
    label: "HDD Type",
    id: "HDDType",
    selector: "#ac_HDDType",
    categories: ["all"],
  },
  {
    label: "HDD Size",
    id: "HDDSize",
    selector: "#ac_HDDSize",
    categories: ["all"],
  },
  {
    label: "HDD Speed",
    id: "HDDSpeed",
    selector: "#ac_HDDSpeed",
    categories: ["hardDrive"],
  },
  {
    label: "HDD Caddie",
    id: "HDDCaddie",
    selector: "#ac_HDDCaddie",
    categories: ["all"],
  },
  {
    label: "Caddie Part No",
    id: "CaddiePartNumber",
    selector: "#ac_CaddiePartNumber",
    categories: ["hardDrive"],
  },
  {
    label: "Host Serial",
    id: "HostSerial",
    selector: "#ac_HostSerial",
    categories: ["hardDrive"],
  },
  {
    label: "HDD Removed",
    id: "HDDRemoved",
    selector: "#ac_HDDRemoved",
    categories: ["desktop", "laptop"],
  },
  {
    label: "HDD Qty",
    id: "HDDQty",
    selector: "#ac_HDDQty",
    categories: ["desktop", "laptop"],
  },
  {
    label: "HDD Model",
    id: "HardDriveModel",
    selector: "#ac_HardDriveModel",
    categories: ["desktop", "laptop"],
  },
  {
    label: "HDD Serial",
    id: "HardDriveSerial",
    selector: "#ac_HardDriveSerial",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Storage Medium",
    id: "StorageMedium",
    selector: "#ac_StorageMedium",
    categories: ["desktop", "laptop"],
  },

  // --- Erasure fields ---
  {
    label: "Erasure Method",
    id: "ErasureMethod",
    selector: "#ac_ErasureMethod",
    categories: ["all"],
  },
  {
    label: "Erasure Results",
    id: "ErasureResults",
    selector: "#ac_ErasureResults",
    categories: ["all"],
  },
  {
    label: "Erasure Date",
    id: "ErasureDate",
    selector: "#ac_ErasureDate",
    categories: ["all"],
  },
  {
    label: "Drive Shredded",
    id: "DriveShredded",
    selector: "#ac_DriveShredded",
    categories: ["all"],
  },

  // --- Grading / QC ---
  {
    label: "Pass or Fail",
    id: "PassorFail",
    selector: "#ac_PassorFail",
    isDropdown: true,
    options: [
      { label: "PASS", value: "PASS" },
      { label: "FAIL", value: "FAIL" },
      { label: "N/A", value: "N/A" },
    ],
    categories: ["all"],
  },
  {
    label: "Fail Reason",
    id: "FailReason",
    selector: "#ac_FailReason",
    categories: ["all"],
  },
  {
    label: "Grade",
    id: "Grade",
    selector: "#ac_Grade",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Repaired",
    id: "Repaired",
    selector: "#ac_Repaired",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Final Grade",
    id: "FinalGrade",
    selector: "#ac_FinalGrade",
    categories: ["all"],
  },

  // --- System / CPU / Memory (desktop + laptop only) ---
  {
    label: "CPU Type",
    id: "CPUType",
    selector: "#ac_CPUType",
    categories: ["desktop", "laptop"],
  },
  {
    label: "CPU Speed",
    id: "CPUSpeed",
    selector: "#ac_CPUSpeed",
    categories: ["desktop", "laptop"],
  },
  {
    label: "CPU Cores",
    id: "CPUCores",
    selector: "#ac_CPUCores",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Memory",
    id: "Memory",
    selector: "#ac_Memory",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Memory Speed",
    id: "MemorySpeed",
    selector: "#ac_MemorySpeed",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Memory Config",
    id: "MemoryConfiguration",
    selector: "#ac_MemoryConfiguration",
    categories: ["desktop", "laptop"],
  },

  // --- Peripherals (desktop + laptop) ---
  {
    label: "Optical Drive",
    id: "OpticalDrive",
    selector: "#ac_OpticalDrive",
    categories: ["desktop", "laptop"],
  },
  {
    label: "NIC",
    id: "NIC",
    selector: "#ac_NIC",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Video Adapter",
    id: "VideoAdapter",
    selector: "#ac_VideoAdapter",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Webcam",
    id: "Webcam",
    selector: "#ac_Webcam",
    categories: ["desktop", "laptop"],
  },
  {
    label: "WiFi",
    id: "WIFI",
    selector: "#ac_WIFI",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Ext Ports",
    id: "ExtPorts",
    selector: "#ac_ExtPorts",
    categories: ["desktop", "laptop"],
  },
  {
    label: "COA",
    id: "COA",
    selector: "#ac_COA",
    categories: ["desktop", "laptop"],
  },

  // --- Laptop-only fields ---
  {
    label: "Battery Type",
    id: "BatteryType",
    selector: "#ac_BatteryType",
    categories: ["laptop"],
  },
  {
    label: "Battery Life",
    id: "BatteryLife",
    selector: "#ac_BatteryLife",
    categories: ["laptop"],
  },
  {
    label: "Screen Resolution",
    id: "ScreenResolution",
    selector: "#ac_ScreenResolution",
    categories: ["laptop"],
  },
  {
    label: "Screen Size",
    id: "ScreenSize",
    selector: "#ac_ScreenSize",
    categories: ["laptop"],
  },
  {
    label: "Touch Screen",
    id: "TouchScreen",
    selector: "#ac_TouchScreen",
    categories: ["laptop"],
  },
  {
    label: "Fingerprint Sens",
    id: "FingerprintSens",
    selector: "#ac_FingerprintSens",
    categories: ["laptop"],
  },

  // --- Test Results ---
  {
    label: "CPU Test Results",
    id: "CPUTestResults",
    selector: "#ac_CPUTestResults",
    categories: ["desktop", "laptop"],
  },
  {
    label: "Memory Test Results",
    id: "MemoryTestResults",
    selector: "#ac_MemoryTestResults",
    categories: ["desktop", "laptop"],
  },
  {
    label: "MB Test Results",
    id: "MBTestResults",
    selector: "#ac_MBTestResults",
    categories: ["desktop", "laptop"],
  },
  {
    label: "LCD Test Results",
    id: "LCDTestResults",
    selector: "#ac_LCDTestResults",
    categories: ["laptop"],
  },
  {
    label: "KB Test Results",
    id: "KBTestResults",
    selector: "#ac_KBTestResults",
    categories: ["laptop"],
  },
];

// Helper: filter FIELDS for a given category
function getFieldsForCategory(category) {
  return FIELDS.filter((f) => {
    return f.categories.includes("all") || f.categories.includes(category);
  });
}

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

// ---- PRESET MANAGEMENT CONSTANTS ----
const EXCLUDED_SCAN_FIELDS = [
  "Category",
  "Description",
  "HardDriveSerial",
  "FinalGrade",
];

function getCategoryFields(category) {
  return getFieldsForCategory(category).filter((f) => {
    if (EXCLUDED_SCAN_FIELDS.includes(f.id)) return false;
    if (f.id === "FinalGrade") return false;
    return true;
  });
}

// ---- PRESET STORAGE ----
function generatePresetId() {
  return "preset_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
}

function loadUserPresets() {
  return new Promise((resolve) => {
    safeChrome.storage.local.get(["user_presets"], (result) => {
      resolve(result.user_presets || []);
    });
  });
}

function saveUserPresets(presets) {
  return new Promise((resolve) => {
    safeChrome.storage.local.set({ user_presets: presets }, resolve);
  });
}

// ---- PRESET UI ----
let currentEditingPresetId = null;

async function renderUserPresetButtons() {
  const presets = await loadUserPresets();
  const container = document.getElementById("userPresetButtons");
  const divider = document.getElementById("savedPresetsDivider");
  if (!container) return;

  container.innerHTML = "";

  if (presets.length === 0) {
    if (divider) divider.style.display = "none";
    return;
  }

  if (divider) divider.style.display = "flex";

  presets.forEach((preset) => {
    const btn = document.createElement("button");
    btn.className = "preset-btn user-preset-btn";
    btn.innerHTML = `<span class="preset-btn-name">${escapeHtml(preset.name)}</span><span class="preset-btn-edit" data-edit-id="${preset.id}" title="Edit preset">\u2699</span>`;
    btn.addEventListener("click", (e) => {
      if (e.target.classList.contains("preset-btn-edit")) {
        openPresetManager(e.target.dataset.editId);
        return;
      }
      applyUserPreset(preset);
    });
    container.appendChild(btn);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function applyUserPreset(preset) {
  const data = { ...preset.fields };
  if (data.Grade) {
    data.FinalGrade = data.Grade;
  }
  await fillAndSubmit(data, true);
}

// ---- PRESET MANAGER ----
function openPresetManager(presetId) {
  const panel = document.getElementById("presetManager");
  const title = document.getElementById("presetManagerTitle");
  const nameInput = document.getElementById("presetName");
  const categorySelect = document.getElementById("presetCategory");
  const deleteBtn = document.getElementById("deletePresetBtn");
  if (!panel) return;

  panel.style.display = "block";

  if (presetId) {
    currentEditingPresetId = presetId;
    if (title) title.textContent = "Edit Preset";
    loadUserPresets().then((presets) => {
      const preset = presets.find((p) => p.id === presetId);
      if (!preset) return;
      if (nameInput) nameInput.value = preset.name;
      if (categorySelect) categorySelect.value = preset.category;
      buildPresetManagerFields(preset.category, preset.fields);
    });
    if (deleteBtn) deleteBtn.style.display = "inline-block";
  } else {
    currentEditingPresetId = null;
    if (title) title.textContent = "New Preset";
    if (nameInput) nameInput.value = "";
    if (categorySelect) categorySelect.value = "desktop";
    buildPresetManagerFields("desktop", {});
    if (deleteBtn) {
      deleteBtn.style.display = "none";
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.remove("confirm");
    }
  }
}

function closePresetManager() {
  const panel = document.getElementById("presetManager");
  if (panel) panel.style.display = "none";
  currentEditingPresetId = null;

  const deleteBtn = document.getElementById("deletePresetBtn");
  if (deleteBtn) {
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.remove("confirm");
  }
}

function buildPresetManagerFields(category, existingValues) {
  const container = document.getElementById("presetManagerFields");
  if (!container) return;
  container.innerHTML = "";

  const fields = getCategoryFields(category);
  fields.forEach((field) => {
    const row = document.createElement("div");
    row.className = "form-row";

    if (field.isDropdown && field.options) {
      const selectOptions = field.options
        .map((opt) => {
          if (typeof opt === "string") {
            return `<option value="${opt}">${opt}</option>`;
          }
          return `<option value="${opt.value}">${opt.label}</option>`;
        })
        .join("");
      row.innerHTML = `
        <label>${field.label}:</label>
        <select id="pm_${field.id}">
          <option value="">-- Select --</option>
          ${selectOptions}
        </select>
      `;
    } else {
      row.innerHTML = `
        <label>${field.label}:</label>
        <input type="text" id="pm_${field.id}" placeholder="">
      `;
    }
    container.appendChild(row);

    if (existingValues && existingValues[field.id]) {
      const input = document.getElementById(`pm_${field.id}`);
      if (input) input.value = existingValues[field.id];
    }
  });
}

async function savePresetFromManager() {
  const nameInput = document.getElementById("presetName");
  const categorySelect = document.getElementById("presetCategory");
  if (!nameInput || !categorySelect) return;

  const name = nameInput.value.trim();
  const category = categorySelect.value;

  if (!name) {
    showStatus("\u26A0 Please enter a preset name", true);
    return;
  }

  if (name.length > 50) {
    showStatus("\u26A0 Preset name must be 50 characters or less", true);
    return;
  }

  const fields = {};
  const categoryFields = getCategoryFields(category);
  categoryFields.forEach((field) => {
    const input = document.getElementById(`pm_${field.id}`);
    if (input && input.value.trim()) {
      fields[field.id] = input.value.trim();
    }
  });

  if (Object.keys(fields).length === 0) {
    showStatus("\u26A0 No fields filled", true);
    return;
  }

  if (fields.Grade) {
    fields.FinalGrade = fields.Grade;
  }

  const presets = await loadUserPresets();

  if (currentEditingPresetId) {
    const idx = presets.findIndex((p) => p.id === currentEditingPresetId);
    if (idx !== -1) {
      presets[idx] = { ...presets[idx], name, category, fields };
    }
  } else {
    presets.push({ id: generatePresetId(), name, category, fields });
  }

  await saveUserPresets(presets);
  await renderUserPresetButtons();
  closePresetManager();
  showStatus("\u2713 Preset saved!");
}

async function deleteUserPreset() {
  const deleteBtn = document.getElementById("deletePresetBtn");
  if (!deleteBtn || !currentEditingPresetId) return;

  if (!deleteBtn.classList.contains("confirm")) {
    deleteBtn.textContent = "Confirm Delete";
    deleteBtn.classList.add("confirm");
    return;
  }

  const presets = await loadUserPresets();
  const filtered = presets.filter((p) => p.id !== currentEditingPresetId);
  await saveUserPresets(filtered);
  await renderUserPresetButtons();
  closePresetManager();
  showStatus("\u2713 Preset deleted");
}

// ---- PAGE SCAN ----
async function scanPageForPreset() {
  try {
    const [tab] = await safeChrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.id) {
      showStatus("\u274C No active tab found", true);
      return;
    }

    const results = await safeChrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (fieldMappings, excludedFields) => {
        const values = {};
        let detectedCategory = "desktop";

        const categoryEl = document.querySelector("#ac_Category");
        const categoryValue = categoryEl ? categoryEl.value : "";

        if (categoryValue.toLowerCase().includes("laptop")) {
          detectedCategory = "laptop";
        } else if (categoryValue.toLowerCase().includes("hard drive")) {
          detectedCategory = "hardDrive";
        } else {
          detectedCategory = "desktop";
        }

        fieldMappings.forEach((field) => {
          if (excludedFields.includes(field.id)) return;
          const el = document.querySelector(field.selector);
          if (el && el.value && el.value.trim()) {
            values[field.id] = el.value.trim();
          }
        });

        return { values, detectedCategory };
      },
      args: [FIELDS, EXCLUDED_SCAN_FIELDS],
    });

    if (!results || !results[0] || !results[0].result) {
      showStatus("\u274C Failed to scan page", true);
      return;
    }

    const { values, detectedCategory } = results[0].result;

    if (Object.keys(values).length === 0) {
      showStatus("\u26A0 No field values found on page", true);
      return;
    }

    const panel = document.getElementById("presetManager");
    const title = document.getElementById("presetManagerTitle");
    const nameInput = document.getElementById("presetName");
    const categorySelect = document.getElementById("presetCategory");
    const deleteBtn = document.getElementById("deletePresetBtn");

    currentEditingPresetId = null;
    if (panel) panel.style.display = "block";
    if (title) title.textContent = "New Preset (Scanned)";
    if (nameInput) nameInput.value = "";
    if (categorySelect) categorySelect.value = detectedCategory;

    buildPresetManagerFields(detectedCategory, values);

    if (deleteBtn) {
      deleteBtn.style.display = "none";
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.remove("confirm");
    }

    showStatus("\u2713 Scanned " + Object.keys(values).length + " fields");
  } catch (err) {
    showStatus("Error scanning: " + err.message, true);
  }
}

// ---- PRESET MANAGER LISTENERS ----
function setupPresetManagerListeners() {
  const newPresetBtn = document.getElementById("newPresetBtn");
  const savePresetBtn = document.getElementById("savePresetBtn");
  const cancelPresetBtn = document.getElementById("cancelPresetBtn");
  const deletePresetBtn = document.getElementById("deletePresetBtn");
  const scanPresetBtn = document.getElementById("scanPresetBtn");
  const categorySelect = document.getElementById("presetCategory");

  if (newPresetBtn)
    newPresetBtn.addEventListener("click", () => openPresetManager());
  if (savePresetBtn)
    savePresetBtn.addEventListener("click", savePresetFromManager);
  if (cancelPresetBtn)
    cancelPresetBtn.addEventListener("click", closePresetManager);
  if (deletePresetBtn)
    deletePresetBtn.addEventListener("click", deleteUserPreset);
  if (scanPresetBtn) scanPresetBtn.addEventListener("click", scanPageForPreset);

  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      const currentValues = {};
      document.querySelectorAll('[id^="pm_"]').forEach((input) => {
        if (input.value && input.value.trim()) {
          const fieldId = input.id.replace("pm_", "");
          currentValues[fieldId] = input.value.trim();
        }
      });
      buildPresetManagerFields(categorySelect.value, currentValues);
    });
  }
}

// ---- MASTER ITEM FIELD MAPPINGS ----
const MASTER_ITEM_FIELDS = [
  // --- Attribute Defaults (Hard Drive set) ---
  { group: "Attribute Defaults" },
  {
    label: "Packaging",
    id: "mi_packaging",
    selector: "#ac_Attribute_47",
    type: "autocomplete",
    default: "SINGLE",
    isDropdown: true,
    options: [
      { label: "SINGLE", value: "SINGLE" },
      { label: "BAG", value: "BAG" },
      { label: "BOXED", value: "BOXED" },
    ],
  },
  {
    label: "Form Factor",
    id: "mi_formFactor",
    selector: "#ac_Attribute_5022",
    type: "autocomplete",
  },
  {
    label: "HDD Speed",
    id: "mi_hddSpeed",
    selector: "#ac_Attribute_6138",
    type: "autocomplete",
  },
  {
    label: "HDD Type",
    id: "mi_hddType",
    selector: "#ac_Attribute_6139",
    type: "autocomplete",
  },
  {
    label: "HDD Caddie",
    id: "mi_hddCaddie",
    selector: "#ac_Attribute_6134",
    type: "autocomplete",
  },
  {
    label: "Caddie Part Number",
    id: "mi_caddiePartNumber",
    selector: "#ac_Attribute_5019",
    type: "autocomplete",
  },
  {
    label: "Erasure Method",
    id: "mi_erasureMethod",
    selector: "#ac_Attribute_6089",
    type: "autocomplete",
  },
  {
    label: "Erasure Date",
    id: "mi_erasureDate",
    selector: "#ac_Attribute_6088",
    type: "autocomplete",
  },
  {
    label: "Erasure Results",
    id: "mi_erasureResults",
    selector: "#ac_Attribute_6090",
    type: "autocomplete",
  },
];

// ---- MASTER ITEM UI ----
function buildMasterItemForm() {
  const container = document.getElementById("mi-form-fields");
  if (!container) return;
  container.innerHTML = "";

  MASTER_ITEM_FIELDS.forEach((field) => {
    if (field.group) {
      const groupLabel = document.createElement("div");
      groupLabel.className = "mi-group-label";
      groupLabel.textContent = field.group;
      container.appendChild(groupLabel);
      return;
    }

    const row = document.createElement("div");
    row.className =
      "form-row" + (field.type === "checkbox" ? " checkbox-row" : "");

    if (field.type === "checkbox") {
      row.innerHTML = `
        <label>${field.label}:</label>
        <input type="checkbox" id="field_${field.id}">
      `;
    } else if (field.isDropdown && field.options) {
      const selectOptions = field.options
        .map((opt) => {
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
      row.innerHTML = `
        <label>${field.label}:</label>
        <input type="text" id="field_${field.id}" placeholder="${field.default || ""}">
      `;
    }
    container.appendChild(row);
  });
}

function getMasterItemFormData() {
  const data = {};
  MASTER_ITEM_FIELDS.forEach((field) => {
    if (field.group) return;
    const input = document.getElementById(`field_${field.id}`);
    if (!input) return;

    if (field.type === "checkbox") {
      if (input.checked) data[field.id] = true;
    } else {
      const val = input.value.trim();
      if (val) data[field.id] = val;
    }
  });
  return data;
}

function fillMasterItemFormInputs(data) {
  MASTER_ITEM_FIELDS.forEach((field) => {
    if (field.group) return;
    const input = document.getElementById(`field_${field.id}`);
    if (!input) return;

    if (field.type === "checkbox") {
      input.checked = !!data[field.id];
    } else {
      input.value = data[field.id] || "";
    }
  });
}

function saveMasterItemTemplate() {
  const data = getMasterItemFormData();
  if (Object.keys(data).length === 0) {
    showStatus("\u26A0 No fields filled to save", true);
    return;
  }
  safeChrome.storage.local.set({ saved_master_item_template: data }, () => {
    if (chrome.runtime.lastError) {
      showStatus("Error saving: " + chrome.runtime.lastError.message, true);
    } else {
      showStatus("\u2713 Master Item template saved!");
    }
  });
}

function loadMasterItemTemplate() {
  safeChrome.storage.local.get(["saved_master_item_template"], (result) => {
    if (result.saved_master_item_template) {
      fillMasterItemFormInputs(result.saved_master_item_template);
    }
  });
}

function clearMasterItemTemplate() {
  MASTER_ITEM_FIELDS.forEach((field) => {
    if (field.group) return;
    const input = document.getElementById(`field_${field.id}`);
    if (!input) return;
    if (field.type === "checkbox") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });
  safeChrome.storage.local.remove(["saved_master_item_template"]);
  showStatus("\u2713 Master Item template cleared!");
}

async function fillMasterItemPage() {
  const data = getMasterItemFormData();
  if (Object.keys(data).length === 0) {
    showStatus("\u26A0 No fields filled to submit", true);
    return;
  }

  try {
    const [tab] = await safeChrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.id) {
      showStatus("\u274C No active tab found", true);
      return;
    }

    // Build the field list to pass into the page context
    const fieldList = MASTER_ITEM_FIELDS.filter(
      (f) => !f.group && data[f.id] !== undefined,
    ).map((f) => ({
      id: f.id,
      selector: f.selector,
      type: f.type,
      value: data[f.id],
    }));

    const results = await safeChrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (fields) => {
        let filledCount = 0;

        function setAutocomplete(selector, value) {
          const input = document.querySelector(selector);
          if (!input) return false;
          const hidden = input.nextElementSibling;
          if (
            input.classList.contains("ui-autocomplete-input") &&
            typeof $ !== "undefined" &&
            $.fn &&
            $.fn.autocomplete
          ) {
            const $input = $(input);
            $input.val(value);
            if (hidden && hidden.type === "hidden") hidden.value = value;
            $input.trigger("input").trigger("change");
            try {
              $input.autocomplete("close");
            } catch (e) {}
          } else {
            input.value = value;
            if (hidden && hidden.type === "hidden") hidden.value = value;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
          input.dispatchEvent(new Event("blur", { bubbles: true }));
          return true;
        }

        function setTextField(selector, value) {
          const input = document.querySelector(selector);
          if (!input) return false;
          input.value = value;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          input.dispatchEvent(new Event("blur", { bubbles: true }));
          return true;
        }

        function setCheckbox(selector, value) {
          const input = document.querySelector(selector);
          if (!input) return false;
          if (input.checked !== value) {
            input.checked = value;
            input.dispatchEvent(new Event("change", { bubbles: true }));
            input.dispatchEvent(new Event("click", { bubbles: true }));
          }
          return true;
        }

        fields.forEach((field) => {
          let success = false;
          if (field.type === "autocomplete") {
            success = setAutocomplete(field.selector, field.value);
          } else if (field.type === "checkbox") {
            success = setCheckbox(field.selector, field.value);
          } else {
            success = setTextField(field.selector, field.value);
          }
          if (success) filledCount++;
        });

        // Close any open autocomplete dropdowns
        try {
          if (typeof $ !== "undefined" && $.fn && $.fn.autocomplete) {
            $(".ui-autocomplete-input").autocomplete("close");
          }
        } catch (e) {}
        document
          .querySelectorAll(".ui-autocomplete")
          .forEach((menu) => (menu.style.display = "none"));
        if (document.activeElement) document.activeElement.blur();

        return { success: true, filledCount };
      },
      args: [fieldList],
    });

    if (results && results[0] && results[0].result) {
      showStatus(
        `\u2713 Filled ${results[0].result.filledCount} Master Item field(s)!`,
      );
    } else {
      showStatus("\u2713 Master Item form filled!");
    }
  } catch (err) {
    showStatus("Error: " + err.message, true);
  }
}

async function scanMasterItemPage() {
  try {
    const [tab] = await safeChrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.id) {
      showStatus("\u274C No active tab found", true);
      return;
    }

    const fieldDefs = MASTER_ITEM_FIELDS.filter((f) => !f.group).map((f) => ({
      id: f.id,
      selector: f.selector,
      type: f.type,
    }));

    const results = await safeChrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (fields) => {
        const values = {};
        fields.forEach((field) => {
          const el = document.querySelector(field.selector);
          if (!el) return;
          if (field.type === "checkbox") {
            if (el.checked) values[field.id] = true;
          } else {
            const val = el.value ? el.value.trim() : "";
            if (val) values[field.id] = val;
          }
        });
        return values;
      },
      args: [fieldDefs],
    });

    if (!results || !results[0] || !results[0].result) {
      showStatus("\u274C Failed to scan Master Item page", true);
      return;
    }

    const scannedValues = results[0].result;
    if (Object.keys(scannedValues).length === 0) {
      showStatus("\u26A0 No field values found on page", true);
      return;
    }

    fillMasterItemFormInputs(scannedValues);
    showStatus(
      `\u2713 Scanned ${Object.keys(scannedValues).length} Master Item field(s)`,
    );
  } catch (err) {
    showStatus("Error scanning: " + err.message, true);
  }
}

function setupMasterItemListeners() {
  const toggle = document.getElementById("masterItemToggle");
  const section = document.getElementById("masterItemSection");
  const arrow = document.getElementById("masterItemArrow");

  if (toggle && section && arrow) {
    toggle.addEventListener("click", () => {
      section.classList.toggle("show");
      arrow.classList.toggle("open");
    });
  }

  const saveBtn = document.getElementById("miSaveBtn");
  const fillBtn = document.getElementById("miFillBtn");
  const clearBtn = document.getElementById("miClearBtn");

  if (saveBtn) saveBtn.addEventListener("click", saveMasterItemTemplate);
  if (fillBtn) fillBtn.addEventListener("click", fillMasterItemPage);
  if (clearBtn) clearBtn.addEventListener("click", clearMasterItemTemplate);
}

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
  setupPresetManagerListeners();
  renderUserPresetButtons();
  buildMasterItemForm();
  loadMasterItemTemplate();
  setupMasterItemListeners();
}

// ---- BUILD FORM ----
// Track current template category
let currentTemplateCategory = "desktop";

function buildForm(category) {
  if (category) currentTemplateCategory = category;
  const container = document.getElementById("form-fields");
  if (!container) return;

  // Save current values before rebuilding
  const savedValues = {};
  FIELDS.forEach((field) => {
    const input = document.getElementById(`field_${field.id}`);
    if (input && input.value && input.value.trim()) {
      savedValues[field.id] = input.value.trim();
    }
  });

  container.innerHTML = "";
  const filteredFields = getFieldsForCategory(currentTemplateCategory);

  filteredFields.forEach((field) => {
    // Skip Final Grade field for desktop/laptop (auto-filled from Grade)
    if (field.id === "FinalGrade" && currentTemplateCategory !== "hardDrive") {
      return;
    }

    const row = document.createElement("div");
    row.className = "form-row";

    if (field.isDropdown && field.options) {
      const selectOptions = field.options
        .map((opt) => {
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
      row.innerHTML = `
        <label>${field.label}:</label>
        <input type="text" id="field_${field.id}" placeholder="">
      `;
    }
    container.appendChild(row);

    // Restore saved value if it exists
    if (savedValues[field.id]) {
      const input = document.getElementById(`field_${field.id}`);
      if (input) input.value = savedValues[field.id];
    }
  });
}

// ---- LOAD / SAVE ----
function loadSavedTemplate() {
  safeChrome.storage.local.get(["saved_template"], (result) => {
    if (result.saved_template) fillFormInputs(result.saved_template);
  });
}

function fillFormInputs(data) {
  // If saved data has a category, switch to it first
  if (data._category) {
    const catSelect = document.getElementById("templateCategory");
    if (catSelect) catSelect.value = data._category;
    buildForm(data._category);
  }
  Object.keys(data).forEach((key) => {
    if (key === "FinalGrade" || key === "_category") return;
    const input = document.getElementById(`field_${key}`);
    if (input) input.value = data[key] || "";
  });
}

// ---- EVENT LISTENERS ----
function setupEventListeners() {
  // Presets - pass isPreset=true
  const presetButtons = document.querySelectorAll("[data-preset]");
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = PRESETS[btn.dataset.preset];
      fillAndSubmit(preset, true); // TRUE = this is a preset button
    });
  });

  // Save / Fill / Clear
  const actionButtons = document.querySelectorAll("[data-action]");
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "save") saveTemplate();
      else if (action === "fill") fillCustomTemplate();
      else if (action === "clear") clearTemplate();
    });
  });

  // Category dropdown for Custom Template
  const templateCategory = document.getElementById("templateCategory");
  if (templateCategory) {
    templateCategory.addEventListener("change", () => {
      buildForm(templateCategory.value);
    });
  }
}

// ---- ACTIONS ----
function getVisibleTemplateData() {
  const data = {};
  const filteredFields = getFieldsForCategory(currentTemplateCategory);
  filteredFields.forEach((field) => {
    const input = document.getElementById(`field_${field.id}`);
    if (input && input.value.trim()) {
      data[field.id] = input.value.trim();
    }
  });
  return data;
}

function saveTemplate() {
  const data = getVisibleTemplateData();

  // ALWAYS force Final Grade to match Grade (override any existing value)
  if (data.Grade) {
    data.FinalGrade = data.Grade;
  }

  if (Object.keys(data).length === 0) {
    showStatus("\u26A0 No fields filled to save", true);
    return;
  }

  // Save the selected category alongside the field data
  data._category = currentTemplateCategory;

  safeChrome.storage.local.set({ saved_template: data }, () => {
    if (chrome.runtime.lastError) {
      showStatus("Error saving: " + chrome.runtime.lastError.message, true);
    } else {
      showStatus("\u2713 Template saved!");
    }
  });
}

async function fillCustomTemplate() {
  const data = getVisibleTemplateData();

  // ALWAYS force Final Grade to match Grade (override any existing value)
  if (data.Grade) {
    data.FinalGrade = data.Grade;
  }

  if (Object.keys(data).length === 0) {
    showStatus("\u26A0 No fields filled to submit", true);
    return;
  }

  await fillAndSubmit(data, false); // FALSE = this is custom template, no auto-detection
}

function clearTemplate() {
  const filteredFields = getFieldsForCategory(currentTemplateCategory);
  filteredFields.forEach((field) => {
    const input = document.getElementById(`field_${field.id}`);
    if (input) input.value = "";
  });
  safeChrome.storage.local.remove(["saved_template"]);
  showStatus("\u2713 Template cleared!");
}

// ---- PAGE INJECTION ----
async function fillAndSubmit(data, isPreset = false) {
  try {
    const [tab] = await safeChrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      showStatus("\u274C No active tab found", true);
      return;
    }

    if (!tab.id) {
      showStatus("\u274C Invalid tab ID", true);
      return;
    }

    if (!safeChrome.scripting || !safeChrome.scripting.executeScript) {
      showStatus("\u274C Extension scripting API not available", true);
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
              const value = formData[field.id];
              const hidden = el.nextElementSibling;

              if (field.isDropdown && el.tagName === "SELECT") {
                const options = Array.from(el.options);
                const matchingOption = options.find(
                  (opt) => opt.value === value || opt.text === value,
                );
                if (matchingOption) {
                  el.selectedIndex = matchingOption.index;
                }
                el.dispatchEvent(new Event("change", { bubbles: true }));
              } else if (
                el.classList.contains("ui-autocomplete-input") &&
                typeof $ !== "undefined" &&
                $.fn &&
                $.fn.autocomplete
              ) {
                const $el = $(el);
                $el.val(value);
                if (hidden && hidden.type === "hidden") hidden.value = value;
                $el.trigger("input").trigger("change");
                try {
                  $el.autocomplete("close");
                } catch (e) {}
              } else {
                el.value = value;
                if (hidden && hidden.type === "hidden") hidden.value = value;
                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));
              }
              el.dispatchEvent(new Event("blur", { bubbles: true }));

              filledCount++;
              results.push({
                field: field.id,
                success: true,
                value: value,
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

        // Close all autocomplete dropdowns after filling
        try {
          if (typeof $ !== "undefined" && $.fn && $.fn.autocomplete) {
            $(".ui-autocomplete-input").autocomplete("close");
          }
        } catch (e) {}
        document
          .querySelectorAll(".ui-autocomplete")
          .forEach((menu) => (menu.style.display = "none"));
        if (document.activeElement) {
          document.activeElement.blur();
        }

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
        showStatus(`\u2713 Filled ${filledCount} field(s)!`);
      } else {
        showStatus(`\u2713 Filled ${filledCount} field(s) for ${deviceType}!`);
      }
    } else {
      showStatus("\u2713 Form filled successfully!");
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

// ---- SIDE PANEL BUTTON ----
{
  const sidePanelBtn = document.getElementById("sidePanelToggle");
  if (sidePanelBtn) {
    sidePanelBtn.addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab) {
        await chrome.sidePanel.open({ tabId: tab.id });
        window.close();
      }
    });
  }

  const closeSidePanelBtn = document.getElementById("closeSidePanel");
  if (closeSidePanelBtn) {
    closeSidePanelBtn.addEventListener("click", () => {
      window.close();
    });
  }
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
