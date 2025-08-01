// Popup script for YouTube Clean Player
document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const statusDiv = document.getElementById('status');
  
  // Get current tab and check if it's YouTube
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    if (!currentTab.url.includes('youtube.com')) {
      toggleButton.textContent = 'Not on YouTube';
      toggleButton.classList.add('disabled');
      toggleButton.disabled = true;
      statusDiv.textContent = 'Please navigate to YouTube to use this extension';
      statusDiv.className = 'status disabled';
      return;
    }
    
    // Check current status
    chrome.tabs.sendMessage(currentTab.id, {action: 'getStatus'}, function(response) {
      if (chrome.runtime.lastError) {
        // Extension not loaded yet, assume enabled
        updateUI(true);
      } else {
        updateUI(response.enabled);
      }
    });
    
    // Set up toggle functionality
    toggleButton.addEventListener('click', function() {
      if (toggleButton.disabled) return;
      
      chrome.tabs.sendMessage(currentTab.id, {action: 'toggle'}, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          statusDiv.textContent = 'Error communicating with page. Please refresh YouTube.';
          statusDiv.className = 'status disabled';
        } else {
          updateUI(response.enabled);
        }
      });
    });
  });
  
  function updateUI(enabled) {
    if (enabled) {
      toggleButton.textContent = 'Disable Clean Mode';
      toggleButton.classList.remove('disabled');
      statusDiv.textContent = '✅ Clean mode is ACTIVE - Only video player shown';
      statusDiv.className = 'status enabled';
    } else {
      toggleButton.textContent = 'Enable Clean Mode';
      toggleButton.classList.remove('disabled');
      statusDiv.textContent = '❌ Clean mode is OFF - Full YouTube interface';
      statusDiv.className = 'status disabled';
    }
    toggleButton.disabled = false;
  }
});
