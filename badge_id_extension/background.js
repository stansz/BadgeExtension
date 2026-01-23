// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item for calculating selected hex
  chrome.contextMenus.create({
    id: 'calculateSelectedHex',
    title: 'Calculate Selected Hex (HID 35-bit)',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'calculateSelectedHex') {
    const selectedText = info.selectionText.trim();
    
    // Validate that the selection is a valid hex value
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (hexRegex.test(selectedText)) {
      // Open the popup with the selected hex value
      chrome.action.openPopup();
      
      // Send message to popup with the hex value
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'calculateSelectedHex',
          hexValue: selectedText
        }).catch(() => {
          // If popup is not ready, try opening with URL parameter
          chrome.windows.create({
            url: chrome.runtime.getURL('popup.html') + '?hex=' + encodeURIComponent(selectedText),
            type: 'popup',
            width: 400,
            height: 600
          });
        });
      }, 100);
    } else {
      // Show error notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.svg',
        title: 'HID Card Calculator',
        message: 'Invalid hex value selected. Please select a valid hex string (0-9, A-F).'
      });
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyToClipboard') {
    navigator.clipboard.writeText(request.text).then(() => {
      sendResponse({ success: true });
    }).catch(err => {
      sendResponse({ success: false, error: err.message });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'showNotification') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.svg',
      title: request.title || 'HID Card Calculator',
      message: request.message
    });
    sendResponse({ success: true });
  }
  
  return true;
});
