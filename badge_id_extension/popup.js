// DOM Elements
const tabHid = document.getElementById('tabHid');
const tabHex = document.getElementById('tabHex');
const hidMode = document.getElementById('hidMode');
const hexMode = document.getElementById('hexMode');
const popoutBtn = document.getElementById('popoutBtn');

// HID 35-bit Elements
const hidHexInput = document.getElementById('hidHexInput');
const hidCalculateBtn = document.getElementById('hidCalculateBtn');
const hidResetBtn = document.getElementById('hidResetBtn');
const hidResults = document.getElementById('hidResults');
const hidError = document.getElementById('hidError');
const hidBitPattern = document.getElementById('hidBitPattern');
const hidCardFormat = document.getElementById('hidCardFormat');
const hidCardNumber = document.getElementById('hidCardNumber');
const hidFacilityCode = document.getElementById('hidFacilityCode');
const hidCopyBtn = document.getElementById('hidCopyBtn');

// Hex/Decimal Elements
const hexDecInput = document.getElementById('hexDecInput');
const hexDecCalculateBtn = document.getElementById('hexDecCalculateBtn');
const hexDecResetBtn = document.getElementById('hexDecResetBtn');
const hexDecResults = document.getElementById('hexDecResults');
const hexDecError = document.getElementById('hexDecError');
const hexDecInputDisplay = document.getElementById('hexDecInputDisplay');
const hexDecResult = document.getElementById('hexDecResult');
const hexDecCopyBtn = document.getElementById('hexDecCopyBtn');

// Tab switching
tabHid.addEventListener('click', () => switchMode('hid'));
tabHex.addEventListener('click', () => switchMode('hex'));

function switchMode(mode) {
  if (mode === 'hid') {
    tabHid.classList.add('active');
    tabHex.classList.remove('active');
    hidMode.classList.add('active');
    hexMode.classList.remove('active');
  } else {
    tabHex.classList.add('active');
    tabHid.classList.remove('active');
    hexMode.classList.add('active');
    hidMode.classList.remove('active');
  }
}

// Popout functionality
let popoutWindowId = null;
popoutBtn.addEventListener('click', () => {
  // Check if a popout window already exists
  if (popoutWindowId !== null) {
    chrome.windows.get(popoutWindowId, (existingWindow) => {
      if (!chrome.runtime.lastError && existingWindow) {
        // Focus existing window
        chrome.windows.update(popoutWindowId, { focused: true });
      } else {
        // Window was closed, create a new one
        createPopoutWindow();
      }
    });
  } else {
    createPopoutWindow();
  }
});

function createPopoutWindow() {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 400,
    height: 600
  }, (window) => {
    if (window) {
      popoutWindowId = window.id;
      // Listen for window being closed
      chrome.windows.onRemoved.addListener((closedWindowId) => {
        if (closedWindowId === popoutWindowId) {
          popoutWindowId = null;
        }
      });
    }
  });
}

// HID 35-bit Calculator
hidCalculateBtn.addEventListener('click', calculateHid35);
hidResetBtn.addEventListener('click', resetHid);
hidCopyBtn.addEventListener('click', () => copyHidResults());

function calculateHid35() {
  hideError(hidError);
  const hexValue = hidHexInput.value.trim();
  
  if (!hexValue) {
    showError(hidError, 'Please enter a hex value');
    return;
  }
  
  // Validate hex format
  const hexRegex = /^[0-9A-Fa-f]+$/;
  if (!hexRegex.test(hexValue)) {
    showError(hidError, 'Invalid hex format. Please use only 0-9 and A-F characters.');
    return;
  }
  
  // Validate hex length (35-bit = 9 hex characters max)
  if (hexValue.length > 9) {
    showError(hidError, 'Hex value too long. Maximum 9 characters for 35-bit format.');
    return;
  }
  
  try {
    const result = convertHid35Bit(hexValue);
    displayHidResults(result);
  } catch (error) {
    showError(hidError, error.message);
  }
}

function convertHid35Bit(hexValue) {
  // Convert hex to decimal
  const decimalValue = parseInt(hexValue, 16);
  
  // Convert to binary string (35 bits, padded)
  const binary = decimalValue.toString(2).padStart(35, '0');
  
  // HID Corporate 1000 35-bit format:
  // [Parity][Facility Code (16 bits)][Card Number (16 bits)][Parity]
  // Bit positions: 1-35 (1-indexed from left)
  
  // Extract facility code (bits 2-17, 16 bits)
  const facilityCodeBinary = binary.substring(1, 17);
  const facilityCode = parseInt(facilityCodeBinary, 2);
  
  // Extract card number (bits 18-33, 16 bits)
  const cardNumberBinary = binary.substring(17, 33);
  const cardNumber = parseInt(cardNumberBinary, 2);
  
  return {
    bitPattern: binary,
    cardFormat: 'HID Corporate 1000 35 Bit',
    cardNumber: cardNumber.toString(),
    facilityCode: facilityCode.toString()
  };
}

function displayHidResults(result) {
  hidBitPattern.textContent = result.bitPattern;
  hidCardFormat.textContent = result.cardFormat;
  hidCardNumber.textContent = result.cardNumber;
  hidFacilityCode.textContent = result.facilityCode;
  hidResults.classList.remove('hidden');
}

function resetHid() {
  hidHexInput.value = '';
  hidResults.classList.add('hidden');
  hideError(hidError);
}

function copyHidResults() {
  const text = `HID 35-bit Card Results:\n` +
    `Bit Pattern: ${hidBitPattern.textContent}\n` +
    `Card Format: ${hidCardFormat.textContent}\n` +
    `Internal Card #: ${hidCardNumber.textContent}\n` +
    `Facility Code: ${hidFacilityCode.textContent}`;
  
  copyToClipboard(text);
}

// Hex/Decimal Converter
hexDecCalculateBtn.addEventListener('click', calculateHexDec);
hexDecResetBtn.addEventListener('click', resetHexDec);
hexDecCopyBtn.addEventListener('click', () => copyHexDecResult());

function calculateHexDec() {
  hideError(hexDecError);
  const inputValue = hexDecInput.value.trim();
  const direction = document.querySelector('input[name="conversionDirection"]:checked').value;
  
  if (!inputValue) {
    showError(hexDecError, 'Please enter a value to convert');
    return;
  }
  
  try {
    let result;
    if (direction === 'hexToDec') {
      result = hexToDecimal(inputValue);
    } else {
      result = decimalToHex(inputValue);
    }
    displayHexDecResults(inputValue, result);
  } catch (error) {
    showError(hexDecError, error.message);
  }
}

function hexToDecimal(hexValue) {
  // Validate hex format
  const hexRegex = /^[0-9A-Fa-f]+$/;
  if (!hexRegex.test(hexValue)) {
    throw new Error('Invalid hex format. Please use only 0-9 and A-F characters.');
  }
  
  const decimal = parseInt(hexValue, 16);
  return decimal.toString();
}

function decimalToHex(decimalValue) {
  // Validate decimal format
  const decRegex = /^[0-9]+$/;
  if (!decRegex.test(decimalValue)) {
    throw new Error('Invalid decimal format. Please use only 0-9 characters.');
  }
  
  const decimal = parseInt(decimalValue, 10);
  const hex = decimal.toString(16).toUpperCase();
  return hex;
}

function displayHexDecResults(input, result) {
  hexDecInputDisplay.textContent = input;
  hexDecResult.textContent = result;
  hexDecResults.classList.remove('hidden');
}

function resetHexDec() {
  hexDecInput.value = '';
  hexDecResults.classList.add('hidden');
  hideError(hexDecError);
}

function copyHexDecResult() {
  const text = `Conversion Result:\nInput: ${hexDecInputDisplay.textContent}\nResult: ${hexDecResult.textContent}`;
  copyToClipboard(text);
}

// Utility functions
function showError(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
}

function hideError(element) {
  element.classList.add('hidden');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.svg',
      title: 'HID Card Calculator',
      message: 'Results copied to clipboard!'
    });
  }).catch(err => {
    console.error('Failed to copy to clipboard:', err);
    // Show error in the appropriate error div based on which mode is active
    if (hidMode.classList.contains('active')) {
      showError(hidError, 'Failed to copy to clipboard');
    } else {
      showError(hexDecError, 'Failed to copy to clipboard');
    }
  });
}

// Handle context menu hex value from storage
function checkContextMenuHex() {
  chrome.storage.local.get(['contextMenuHex'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error reading from storage:', chrome.runtime.lastError);
      return;
    }
    if (result.contextMenuHex) {
      console.log('Found context menu hex value:', result.contextMenuHex);
      // Switch to HID mode
      switchMode('hid');
      // Set the hex value
      hidHexInput.value = result.contextMenuHex;
      // Calculate
      calculateHid35();
      // Copy results to clipboard
      setTimeout(() => {
        copyHidResults();
      }, 100);
      // Clear the stored value after using it
      chrome.storage.local.remove(['contextMenuHex'], () => {
        if (chrome.runtime.lastError) {
          console.error('Error clearing storage:', chrome.runtime.lastError);
        }
      });
    }
  });
}

// Initialize: Check if there's a pre-populated value from context menu or URL
document.addEventListener('DOMContentLoaded', () => {
  // First check URL parameters for pre-populated values (for popout windows)
  const urlParams = new URLSearchParams(window.location.search);
  const prePopulatedHex = urlParams.get('hex');
  
  if (prePopulatedHex) {
    switchMode('hid');
    hidHexInput.value = prePopulatedHex;
    calculateHid35();
  } else {
    // If no URL parameter, check storage for context menu hex value
    checkContextMenuHex();
  }
});
