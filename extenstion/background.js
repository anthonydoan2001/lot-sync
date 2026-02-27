// Background service worker for handling keyboard shortcuts
// Ctrl+Shift+F - Fill form with saved template

// Field mappings (same as in popup.js)
const FIELDS = [
  { label: 'Condition', id: 'Condition', selector: '#ac_Condition' },
  { label: 'Location', id: 'Location', selector: '#ac_Location' },
  { label: 'Category', id: 'Category', selector: '#ac_Category' },
  { label: 'Notes', id: 'Notes', selector: 'textarea[name="Notes"]' },
  { label: 'Next Step', id: 'NextStep', selector: '#dd_AssetWorkflowSteps', isDropdown: true, options: [
    { label: 'Data Collection', value: '0' },
    { label: 'Data Destruction', value: '1' },
    { label: 'Resale', value: '102' },
    { label: 'Scrap', value: '103' }
  ]},
  { label: 'Packaging', id: 'PACKAGING', selector: '#ac_PACKAGING' },
  { label: 'Description', id: 'Description', selector: '#ac_Description' },
  { label: 'Weight', id: 'Weight', selector: 'input[name="Weight"]' },
  { label: 'Form Factor', id: 'FormFactor', selector: '#ac_HardDrive__FormFactor' },
  { label: 'CPU Type', id: 'CPUType', selector: '#ac_CPUType' },
  { label: 'CPU Speed', id: 'CPUSpeed', selector: '#ac_CPUSpeed' },
  { label: 'CPU Cores', id: 'CPUCores', selector: '#ac_CPUCores' },
  { label: 'Memory', id: 'Memory', selector: '#ac_Memory' },
  { label: 'Memory Speed', id: 'MemorySpeed', selector: '#ac_MemorySpeed' },
  { label: 'Memory Config', id: 'MemoryConfiguration', selector: '#ac_MemoryConfiguration' },
  { label: 'HDD Qty', id: 'HDDQty', selector: '#ac_HDDQty' },
  { label: 'HDD Model', id: 'HardDriveModel', selector: '#ac_HardDriveModel' },
  { label: 'HDD Serial', id: 'HardDriveSerial', selector: '#ac_HardDriveSerial' },
  { label: 'HDD Type', id: 'HDDType', selector: '#ac_HDDType' },
  { label: 'Storage Medium', id: 'StorageMedium', selector: '#ac_StorageMedium' },
  { label: 'HDD Size', id: 'HDDSize', selector: '#ac_HDDSize' },
  { label: 'HDD Caddie', id: 'HDDCaddie', selector: '#ac_HDDCaddie' },
  { label: 'HDD Removed', id: 'HDDRemoved', selector: '#ac_HDDRemoved' },
  { label: 'Erasure Method', id: 'ErasureMethod', selector: '#ac_ErasureMethod' },
  { label: 'Erasure Results', id: 'ErasureResults', selector: '#ac_ErasureResults' },
  { label: 'Erasure Date', id: 'ErasureDate', selector: '#ac_ErasureDate' },
  { label: 'Drive Shredded', id: 'DriveShredded', selector: '#ac_DriveShredded' },
  { label: 'Optical Drive', id: 'OpticalDrive', selector: '#ac_OpticalDrive' },
  { label: 'Fingerprint Sens', id: 'FingerprintSens', selector: '#ac_FingerprintSens' },
  { label: 'NIC', id: 'NIC', selector: '#ac_NIC' },
  { label: 'Video Adapter', id: 'VideoAdapter', selector: '#ac_VideoAdapter' },
  { label: 'Webcam', id: 'Webcam', selector: '#ac_Webcam' },
  { label: 'WiFi', id: 'WIFI', selector: '#ac_WIFI' },
  { label: 'Ext Ports', id: 'ExtPorts', selector: '#ac_ExtPorts' },
  { label: 'Battery Type', id: 'BatteryType', selector: '#ac_BatteryType' },
  { label: 'Battery Life', id: 'BatteryLife', selector: '#ac_BatteryLife' },
  { label: 'Screen Resolution', id: 'ScreenResolution', selector: '#ac_ScreenResolution' },
  { label: 'Screen Size', id: 'ScreenSize', selector: '#ac_ScreenSize' },
  { label: 'Touch Screen', id: 'TouchScreen', selector: '#ac_TouchScreen' },
  { label: 'COA', id: 'COA', selector: '#ac_COA' },
  { label: 'Pass or Fail', id: 'PassorFail', selector: '#ac_PassorFail' },
  { label: 'Grade', id: 'Grade', selector: '#ac_Grade' },
  { label: 'Fail Reason', id: 'FailReason', selector: '#ac_FailReason' },
  { label: 'Repaired', id: 'Repaired', selector: '#ac_Repaired' },
  { label: 'Final Grade', id: 'FinalGrade', selector: '#ac_FinalGrade' },
  { label: 'CPU Test Results', id: 'CPUTestResults', selector: '#ac_CPUTestResults' },
  { label: 'Memory Test Results', id: 'MemoryTestResults', selector: '#ac_MemoryTestResults' },
  { label: 'MB Test Results', id: 'MBTestResults', selector: '#ac_MBTestResults' },
  { label: 'LCD Test Results', id: 'LCDTestResults', selector: '#ac_LCDTestResults' },
  { label: 'KB Test Results', id: 'KBTestResults', selector: '#ac_KBTestResults' }
];

// Listen for keyboard command
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'fill-form') {
    try {
      // Get the saved template from storage
      const result = await chrome.storage.local.get(['saved_template']);
      
      if (!result.saved_template || Object.keys(result.saved_template).length === 0) {
        // Show a notification
        chrome.notifications.create({
          type: 'basic',
          title: 'No Template Saved',
          message: 'Please save a template first before using Ctrl+Shift+F.',
          priority: 2
        });
        return;
      }
      
      const data = result.saved_template;
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        return;
      }
      
      // Execute the fill script
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (fieldMappings, formData) => {
          // Read Grade from the page (it's already filled manually)
          const gradeElement = document.querySelector('#ac_Grade');
          const currentGrade = gradeElement ? gradeElement.value : null;
          
          // Copy Grade from page to Final Grade
          if (currentGrade) {
            formData.FinalGrade = currentGrade;
          }
          
          let filledCount = 0;
          const results = [];
          
          fieldMappings.forEach((field) => {
            // Only fill fields that have values in formData
            if (formData[field.id]) {
              const el = document.querySelector(field.selector);
              if (el) {
                // Set the value
                el.value = formData[field.id];
                
                // For dropdowns, also try to select by text if value doesn't work
                if (field.isDropdown && el.tagName === 'SELECT') {
                  const options = Array.from(el.options);
                  const matchingOption = options.find(opt => 
                    opt.value === formData[field.id] || 
                    opt.text === formData[field.id]
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
                if (el.classList.contains('ui-autocomplete-input')) {
                  el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
                  el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
                }
                
                filledCount++;
                results.push({ field: field.id, success: true, value: formData[field.id] });
              } else {
                results.push({ field: field.id, success: false, reason: 'not found' });
              }
            }
          });
          return { success: true, filledCount: filledCount, details: results, deviceType: "CUSTOM" };
        },
        args: [FIELDS, data],
      });
      
    } catch (error) {
      // Silent error handling
    }
  }
});

console.log('Background service worker loaded. Ctrl+Shift+F shortcut ready!');