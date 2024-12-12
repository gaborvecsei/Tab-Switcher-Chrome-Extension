let lastTabId = null;

if (!chrome.storage || !chrome.storage.local) {
  console.error("chrome.storage.local is not available. Ensure permissions are correctly set in manifest.json.");
}

// Listener for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Ensure storage API is available
  if (!chrome.storage || !chrome.storage.local) return;

  chrome.storage.local.get("currentTabId", (data) => {
    if (chrome.runtime.lastError) {
      console.error("Error accessing storage:", chrome.runtime.lastError);
      return;
    }

    // Update the last active tab
    if (data.currentTabId && data.currentTabId !== activeInfo.tabId) {
      lastTabId = data.currentTabId;
    }

    // Store the new current tab ID
    chrome.storage.local.set({ currentTabId: activeInfo.tabId });
  });
});

// Listener for shortcut commands
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-tabs" && lastTabId !== null) {
    chrome.tabs.update(lastTabId, { active: true }, (tab) => {
      if (chrome.runtime.lastError) {
        console.error("Error switching tabs:", chrome.runtime.lastError);
        return;
      }

      // Ensure storage API is available
      if (!chrome.storage || !chrome.storage.local) return;

      chrome.storage.local.get("currentTabId", (data) => {
        if (chrome.runtime.lastError) {
          console.error("Error accessing storage:", chrome.runtime.lastError);
          return;
        }

        lastTabId = data.currentTabId;
        chrome.storage.local.set({ currentTabId: tab.id });
      });
    });
  }
});

