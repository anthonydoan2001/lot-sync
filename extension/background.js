// Background service worker for handling keyboard shortcuts
// Ctrl+Shift+F - Fill form with saved template

// Field mappings (same as in popup.js)
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
    label: "Model Search",
    id: "ModelSearch",
    selector: 'input[name$="_ModelSearch"]',
  },
  {
    label: "Manufacturer",
    id: "Manufacturer",
    selector: 'input[name$="_Manufacturer"]',
  },
  { label: "UID", id: "UniqueId", selector: 'input[name="UniqueId"]' },
  { label: "Serial", id: "Serial", selector: 'input[name="Serial"]' },
  { label: "Asset Tag", id: "AssetTag", selector: 'input[name="AssetTag"]' },
  { label: "Quantity", id: "Quantity", selector: 'input[name="Quantity"]' },
  {
    label: "Form Factor",
    id: "FormFactor",
    selector: "#ac_HardDrive__FormFactor",
  },
  { label: "MODEL", id: "MODEL", selector: "#ac_MODEL" },
  { label: "MPN", id: "MPN", selector: "#ac_MPN" },
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
  { label: "HDD Speed", id: "HDDSpeed", selector: "#ac_HDDSpeed" },
  { label: "HDD Caddie", id: "HDDCaddie", selector: "#ac_HDDCaddie" },
  {
    label: "Caddie Part No",
    id: "CaddiePartNumber",
    selector: "#ac_CaddiePartNumber",
  },
  { label: "Host Serial", id: "HostSerial", selector: "#ac_HostSerial" },
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

// ---- MASTER ITEM FIELD MAPPINGS ----
const MASTER_ITEM_FIELDS_BG = [
  { id: "mi_packaging", selector: "#ac_Attribute_47", type: "autocomplete" },
  { id: "mi_formFactor", selector: "#ac_Attribute_5022", type: "autocomplete" },
  { id: "mi_hddSpeed", selector: "#ac_Attribute_6138", type: "autocomplete" },
  { id: "mi_hddType", selector: "#ac_Attribute_6139", type: "autocomplete" },
  { id: "mi_hddCaddie", selector: "#ac_Attribute_6134", type: "autocomplete" },
  {
    id: "mi_caddiePartNumber",
    selector: "#ac_Attribute_5019",
    type: "autocomplete",
  },
  {
    id: "mi_erasureMethod",
    selector: "#ac_Attribute_6089",
    type: "autocomplete",
  },
  {
    id: "mi_erasureDate",
    selector: "#ac_Attribute_6088",
    type: "autocomplete",
  },
  {
    id: "mi_erasureResults",
    selector: "#ac_Attribute_6090",
    type: "autocomplete",
  },
];

// ---- SHARED FILL HELPER ----
function fillAutocompleteFields(fields) {
  let filledCount = 0;

  function fillAcField(input, value) {
    const $input = $(input);
    const widget =
      $input.data("ui-autocomplete") || $input.data("autocomplete");

    function selectItem(item) {
      widget._trigger("select", null, { item: item });
      $input.val(item.label || value);
      widget.term = item.label || value;
      $input.trigger("change");
    }

    function fallback() {
      $input.val(value);
      if (widget) widget.term = value;
      const hidden = input.nextElementSibling;
      if (hidden && hidden.type === "hidden") hidden.value = value;
      $input.trigger("input").trigger("change");
    }

    if (!widget) {
      fallback();
      return;
    }

    const source = widget.options.source;

    if (typeof source === "function") {
      source({ term: value }, function (results) {
        if (results && results.length > 0) {
          const match =
            results.find(
              (item) =>
                item.label === value || item.label === value.toUpperCase(),
            ) || results[0];
          selectItem(match);
        } else {
          fallback();
        }
      });
    } else if (Array.isArray(source)) {
      const match = source.find(
        (item) =>
          (typeof item === "string" && item === value) ||
          (item.label &&
            (item.label === value || item.label === value.toUpperCase())),
      );
      if (match) {
        selectItem(
          typeof match === "string" ? { label: match, value: match } : match,
        );
      } else {
        fallback();
      }
    } else {
      fallback();
    }
  }

  fields.forEach((field) => {
    const input = document.querySelector(field.selector);
    if (!input) return;

    if (
      input.classList.contains("ui-autocomplete-input") &&
      typeof $ !== "undefined" &&
      $.fn &&
      $.fn.autocomplete
    ) {
      fillAcField(input, field.value);
    } else {
      input.value = field.value;
      const hidden = input.nextElementSibling;
      if (hidden && hidden.type === "hidden") hidden.value = field.value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    filledCount++;
  });

  if (document.activeElement) document.activeElement.blur();

  return { success: true, filledCount };
}

// Listen for keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  // ---- CUSTOM TEMPLATE FILL (Ctrl+Shift+F) ----
  if (command === "fill-form") {
    try {
      const result = await chrome.storage.local.get(["saved_template"]);

      if (
        !result.saved_template ||
        Object.keys(result.saved_template).length === 0
      ) {
        chrome.notifications.create({
          type: "basic",
          title: "No Template Saved",
          message: "Please save a template first before using Ctrl+Shift+F.",
          priority: 2,
        });
        return;
      }

      const data = result.saved_template;
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) return;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (fieldMappings, formData) => {
          const gradeElement = document.querySelector("#ac_Grade");
          const currentGrade = gradeElement ? gradeElement.value : null;
          if (currentGrade) {
            formData.FinalGrade = currentGrade;
          }

          // Helper to properly fill a jQuery UI autocomplete input
          // Calls the widget's source function directly to get the correct ID
          // onDone callback is called after the value is set (handles async sources)
          function fillAutocomplete(el, value, onDone) {
            const $el = $(el);

            // Focus first to ensure widget is fully initialized
            $el.focus();

            const widget =
              $el.data("ui-autocomplete") || $el.data("autocomplete");

            function selectItem(item) {
              widget._trigger("select", null, { item: item });
              $el.val(item.label || value);
              widget.term = item.label || value;
              // Explicitly set the hidden input value (stores the internal ID)
              const hidden = el.nextElementSibling;
              if (hidden && hidden.type === "hidden") {
                hidden.value = item.value || item.id || value;
              }
              $el.trigger("change");
              if (onDone) onDone();
            }

            function fallback() {
              $el.val(value);
              if (widget) widget.term = value;
              const hidden = el.nextElementSibling;
              if (hidden && hidden.type === "hidden") hidden.value = value;
              $el.trigger("input").trigger("change");
              if (onDone) onDone();
            }

            if (!widget) {
              fallback();
              return;
            }

            const source = widget.options.source;

            if (typeof source === "function") {
              source({ term: value }, function (results) {
                if (results && results.length > 0) {
                  const match =
                    results.find(
                      (item) =>
                        item.label === value ||
                        item.label === value.toUpperCase(),
                    ) || results[0];
                  selectItem(match);
                } else {
                  fallback();
                }
              });
            } else if (Array.isArray(source)) {
              const match = source.find(
                (item) =>
                  (typeof item === "string" && item === value) ||
                  (item.label &&
                    (item.label === value ||
                      item.label === value.toUpperCase())),
              );
              if (match) {
                selectItem(
                  typeof match === "string"
                    ? { label: match, value: match }
                    : match,
                );
              } else {
                fallback();
              }
            } else {
              fallback();
            }
          }

          let filledCount = 0;
          const results = [];

          fieldMappings.forEach((field) => {
            if (formData[field.id]) {
              const el = document.querySelector(field.selector);
              if (el) {
                const value = formData[field.id];

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
                  typeof $ !== "undefined" &&
                  $.fn &&
                  $.fn.autocomplete &&
                  (el.classList.contains("ui-autocomplete-input") ||
                    $(el).data("ui-autocomplete") ||
                    $(el).data("autocomplete"))
                ) {
                  fillAutocomplete(el, value, function () {
                    el.dispatchEvent(new Event("blur", { bubbles: true }));
                  });
                } else {
                  el.value = value;
                  const hidden = el.nextElementSibling;
                  if (hidden && hidden.type === "hidden") {
                    hidden.value = value;
                  }
                  el.dispatchEvent(new Event("input", { bubbles: true }));
                  el.dispatchEvent(new Event("change", { bubbles: true }));
                  el.dispatchEvent(new Event("blur", { bubbles: true }));
                }

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

          return {
            success: true,
            filledCount: filledCount,
            details: results,
            deviceType: "CUSTOM",
          };
        },
        args: [FIELDS, data],
      });
    } catch (error) {
      // Silent error handling
    }
  }

  // ---- MASTER ITEM FILL (Ctrl+Shift+M) ----
  if (command === "fill-master-item") {
    try {
      const result = await chrome.storage.local.get([
        "saved_master_item_template",
      ]);

      if (
        !result.saved_master_item_template ||
        Object.keys(result.saved_master_item_template).length === 0
      ) {
        chrome.notifications.create({
          type: "basic",
          title: "No Master Item Template Saved",
          message:
            "Please save a master item template first before using Ctrl+Shift+M.",
          priority: 2,
        });
        return;
      }

      const data = result.saved_master_item_template;
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) return;

      const fieldList = MASTER_ITEM_FIELDS_BG.filter(
        (f) => data[f.id] !== undefined && data[f.id] !== "",
      ).map((f) => ({
        id: f.id,
        selector: f.selector,
        type: f.type,
        value: data[f.id],
      }));

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (fields) => {
          let filledCount = 0;

          function fillAcField(input, value) {
            const $input = $(input);
            const widget =
              $input.data("ui-autocomplete") || $input.data("autocomplete");

            function selectItem(item) {
              widget._trigger("select", null, { item: item });
              $input.val(item.label || value);
              widget.term = item.label || value;
              $input.trigger("change");
            }

            function fallback() {
              $input.val(value);
              if (widget) widget.term = value;
              const hidden = input.nextElementSibling;
              if (hidden && hidden.type === "hidden") hidden.value = value;
              $input.trigger("input").trigger("change");
            }

            if (!widget) {
              fallback();
              return;
            }

            const source = widget.options.source;

            if (typeof source === "function") {
              source({ term: value }, function (results) {
                if (results && results.length > 0) {
                  const match =
                    results.find(
                      (item) =>
                        item.label === value ||
                        item.label === value.toUpperCase(),
                    ) || results[0];
                  selectItem(match);
                } else {
                  fallback();
                }
              });
            } else if (Array.isArray(source)) {
              const match = source.find(
                (item) =>
                  (typeof item === "string" && item === value) ||
                  (item.label &&
                    (item.label === value ||
                      item.label === value.toUpperCase())),
              );
              if (match) {
                selectItem(
                  typeof match === "string"
                    ? { label: match, value: match }
                    : match,
                );
              } else {
                fallback();
              }
            } else {
              fallback();
            }
          }

          fields.forEach((field) => {
            const input = document.querySelector(field.selector);
            if (!input) return;

            if (
              input.classList.contains("ui-autocomplete-input") &&
              typeof $ !== "undefined" &&
              $.fn &&
              $.fn.autocomplete
            ) {
              fillAcField(input, field.value);
            } else {
              input.value = field.value;
              const hidden = input.nextElementSibling;
              if (hidden && hidden.type === "hidden")
                hidden.value = field.value;
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
            input.dispatchEvent(new Event("blur", { bubbles: true }));
            filledCount++;
          });

          if (document.activeElement) document.activeElement.blur();

          return { success: true, filledCount };
        },
        args: [fieldList],
      });
    } catch (error) {
      // Silent error handling
    }
  }
});

console.log(
  "Background service worker loaded. Ctrl+Shift+F and Ctrl+Shift+M shortcuts ready!",
);
