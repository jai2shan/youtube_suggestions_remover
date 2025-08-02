// YouTube Clean Player - Content Script
// This script removes all distractions and shows only the video player

class YouTubeCleanPlayer {
  constructor() {
    this.isEnabled = true;
    this.originalTitle = document.title;
    this.observer = null;
    this.timeUpdateInterval = null;
    this.init();
  }

  init() {
    // Wait for the page to load properly
    const initializeWhenReady = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => this.cleanPage(), 100);
        });
      } else {
        // DOM is already ready
        setTimeout(() => this.cleanPage(), 100);
      }
    };

    initializeWhenReady();

    // Set up mutation observer to handle dynamic content
    // Wait a bit to ensure DOM is fully ready
    setTimeout(() => this.setupObserver(), 500);
    
    // Listen for navigation changes in single-page app
    this.setupNavigationListener();
  }

  cleanPage() {
    // Only clean watch pages
    if (!this.isWatchPage()) return;

    console.log('YouTube Clean Player: Cleaning page...');
    
    // Hide everything first
    this.hideAllElements();
    
    // Show only the video player and essential controls
    this.showVideoPlayer();
    
    // Hide specific YouTube elements
    this.hideYouTubeElements();
    
    // Center the video player
    this.centerVideoPlayer();
    
    // Ensure timeline and controls are visible after cleaning
    setTimeout(() => this.ensureControlsVisible(), 1500);
  }

  isWatchPage() {
    return window.location.pathname === '/watch' && window.location.search.includes('v=');
  }

  hideAllElements() {
    // Hide the main page structure
    const elementsToHide = [
      '#masthead', // Top navigation
      '#secondary', // Sidebar with suggestions
      '#comments', // Comments section
      '#primary #secondary', // Right sidebar
      '.ytd-watch-flexy[slot="secondary"]', // Secondary content
      '#related', // Related videos
      '#chat', // Live chat
      '.ytp-endscreen-content', // End screen suggestions
      '.ytp-ce-element', // Cards and annotations
      'ytd-compact-video-renderer', // Video suggestions
      'ytd-video-secondary-info-renderer', // Video info
      'ytd-video-primary-info-renderer #description', // Description
      'ytd-comments', // Comments
      '#footer', // Footer
      '.ytd-page-manager', // Page manager
      'ytd-two-column-browse-results-renderer' // Browse results
    ];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el) el.style.display = 'none';
      });
    });
  }

  showVideoPlayer() {
    // Ensure video player is visible
    const videoSelectors = [
      '.html5-video-player',
      '#movie_player',
      'video',
      '.video-stream',
      '#player',
      '#player-container',
      'ytd-player'
    ];

    videoSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el) {
          el.style.display = 'block';
          el.style.visibility = 'visible';
        }
      });
    });
  }

  hideYouTubeElements() {
    // Hide specific YouTube UI elements that might appear
    setTimeout(() => {
      const hideSelectors = [
        '.ytp-endscreen-content',
        '.ytp-pause-overlay',
        '.ytp-scroll-min',
        '.ytp-related-on-error-overlay',
        '.ytp-upnext',
        '.ytp-cards-button',
        '.ytp-info-panel',
        'ytd-engagement-panel-section-list-renderer',
        '#secondary-inner',
        '#related',
        '.ytd-watch-next-secondary-results-renderer'
      ];

      hideSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el) el.style.display = 'none !important';
        });
      });
    }, 1000);
    
    // Ensure timeline and quality controls remain visible
    this.ensureControlsVisible();
  }

  ensureControlsVisible() {
    // Force show timeline/progress bar and related controls
    const essentialControls = [
      '.ytp-progress-bar-container',
      '.ytp-progress-bar',
      '.ytp-progress-list',
      '.ytp-scrubber-container',
      '.ytp-scrubber-button',
      '.ytp-time-display',
      '.ytp-time-current',
      '.ytp-time-separator',
      '.ytp-time-duration',
      '.ytp-chrome-bottom',
      '.ytp-chrome-controls',
      '.ytp-left-controls',
      '.ytp-right-controls',
      '.ytp-play-button',
      '.ytp-pause-button',
      '.ytp-next-button',
      '.ytp-prev-button',
      '.ytp-volume-area',
      '.ytp-volume-control',
      '.ytp-mute-button',
      '.ytp-volume-slider',
      '.ytp-settings-button',
      '.ytp-settings-menu',
      '.ytp-panel',
      '.ytp-panel-menu',
      '.ytp-menuitem',
      '.ytp-size-button',
      '.ytp-fullscreen-button',
      '.ytp-subtitles-button',
      '.ytp-caption-window-container'
    ];

    essentialControls.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el) {
          el.style.display = '';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          // Remove any potential hiding classes
          el.classList.remove('hidden');
        }
      });
    });

    // Specifically ensure the settings menu works for quality changes
    this.ensureQualityControls();
    
    // Add custom time remaining display
    this.addTimeRemainingDisplay();
  }

  addTimeRemainingDisplay() {
    // Remove existing custom display if any
    const existingDisplay = document.querySelector('#clean-player-time-remaining');
    if (existingDisplay) {
      existingDisplay.remove();
    }

    // Create time remaining display
    const timeRemainingDiv = document.createElement('div');
    timeRemainingDiv.id = 'clean-player-time-remaining';
    timeRemainingDiv.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: 'YouTube Sans', 'Roboto', sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      pointer-events: none;
      display: none;
    `;

    // Find the video player container
    const playerContainer = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    if (playerContainer) {
      try {
        playerContainer.appendChild(timeRemainingDiv);
        this.updateTimeRemaining();
      } catch (error) {
        console.log('YouTube Clean Player: Could not add time remaining display:', error);
      }
    }
  }

  updateTimeRemaining() {
    const video = document.querySelector('video');
    const timeRemainingDiv = document.querySelector('#clean-player-time-remaining');
    
    if (!video || !timeRemainingDiv) return;

    const updateDisplay = () => {
      if (video.duration && !isNaN(video.duration)) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        const remaining = duration - currentTime;
        
        if (remaining > 0) {
          const hours = Math.floor(remaining / 3600);
          const minutes = Math.floor((remaining % 3600) / 60);
          const seconds = Math.floor(remaining % 60);
          
          let timeText = '';
          if (hours > 0) {
            timeText = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} left`;
          } else {
            timeText = `${minutes}:${seconds.toString().padStart(2, '0')} left`;
          }
          
          timeRemainingDiv.textContent = timeText;
          timeRemainingDiv.style.display = 'block';
        } else {
          timeRemainingDiv.style.display = 'none';
        }
      }
    };

    // Update immediately
    updateDisplay();

    // Update every second
    if (!this.timeUpdateInterval) {
      this.timeUpdateInterval = setInterval(updateDisplay, 1000);
    }

    // Also update on video events
    video.addEventListener('timeupdate', updateDisplay);
    video.addEventListener('loadedmetadata', updateDisplay);
  }

  ensureQualityControls() {
    // Make sure quality/resolution controls are accessible
    setTimeout(() => {
      const qualitySelectors = [
        '.ytp-settings-button',
        '.ytp-settings-menu',
        '.ytp-panel',
        '.ytp-panel-menu',
        '.ytp-menuitem[role="menuitemradio"]', // Quality options
        '.ytp-menuitem-label',
        '.ytp-menuitem-content'
      ];

      qualitySelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el) {
            el.style.display = '';
            el.style.visibility = 'visible';
            el.style.pointerEvents = 'auto';
            el.style.zIndex = '9999';
          }
        });
      });

      // Add a custom quality shortcut button
      this.addQualityShortcut();
    }, 500);
  }

  addQualityShortcut() {
    // Remove existing shortcut if any
    const existingShortcut = document.querySelector('#clean-player-quality-shortcut');
    if (existingShortcut) {
      existingShortcut.remove();
    }

    // Create quality shortcut button
    const qualityButton = document.createElement('div');
    qualityButton.id = 'clean-player-quality-shortcut';
    qualityButton.innerHTML = `
      <div style="
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: 'YouTube Sans', 'Roboto', sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        cursor: pointer;
        user-select: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: background 0.2s;
      " 
      onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'"
      onmouseout="this.style.background='rgba(0, 0, 0, 0.8)'"
      >
        ⚙️ Quality: <span id="current-quality">Auto</span>
      </div>
    `;

    // Find the video player container
    const playerContainer = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    if (playerContainer) {
      try {
        playerContainer.appendChild(qualityButton);
        
        // Add click handler to open settings
        qualityButton.addEventListener('click', () => {
          const settingsButton = document.querySelector('.ytp-settings-button');
          if (settingsButton) {
            settingsButton.click();
            // Wait a bit then try to click quality option
            setTimeout(() => {
              const qualityMenuItem = Array.from(document.querySelectorAll('.ytp-menuitem')).find(
                item => item.textContent.toLowerCase().includes('quality') || 
                        item.textContent.toLowerCase().includes('qualität')
              );
              if (qualityMenuItem) {
                qualityMenuItem.click();
              }
            }, 100);
          }
        });

        // Update current quality display
        this.updateQualityDisplay();
      } catch (error) {
        console.log('YouTube Clean Player: Could not add quality shortcut:', error);
      }
    }
  }

  updateQualityDisplay() {
    const updateQuality = () => {
      const video = document.querySelector('video');
      const qualitySpan = document.querySelector('#current-quality');
      
      if (video && qualitySpan) {
        // Try to get quality from video element
        const videoHeight = video.videoHeight;
        let quality = 'Auto';
        
        if (videoHeight) {
          if (videoHeight >= 2160) quality = '4K';
          else if (videoHeight >= 1440) quality = '1440p';
          else if (videoHeight >= 1080) quality = '1080p';
          else if (videoHeight >= 720) quality = '720p';
          else if (videoHeight >= 480) quality = '480p';
          else if (videoHeight >= 360) quality = '360p';
          else if (videoHeight >= 240) quality = '240p';
          else quality = '144p';
        }
        
        qualitySpan.textContent = quality;
      }
    };

    // Update on video load
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('loadedmetadata', updateQuality);
      video.addEventListener('resize', updateQuality);
      updateQuality(); // Update immediately
    }
  }

  centerVideoPlayer() {
    // Center the video player on the page
    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    if (player) {
      const container = player.closest('#player-container') || player.closest('ytd-player');
      if (container) {
        container.style.margin = '0 auto';
        container.style.maxWidth = '100vw';
        container.style.width = '100%';
      }
    }

    // Hide the primary content wrapper's secondary elements
    const primary = document.querySelector('#primary');
    if (primary) {
      primary.style.width = '100%';
      primary.style.maxWidth = '100%';
    }
  }

  setupObserver() {
    // Watch for DOM changes and reapply cleaning
    this.observer = new MutationObserver((mutations) => {
      if (this.isWatchPage()) {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if new elements were added that we need to hide
            setTimeout(() => this.hideYouTubeElements(), 100);
            // Re-ensure controls are visible after new content loads
            setTimeout(() => this.ensureControlsVisible(), 200);
          }
        });
      }
    });

    // Wait for document.body to be available before observing
    const startObserving = () => {
      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        // If body is not ready, wait a bit and try again
        setTimeout(startObserving, 100);
      }
    };

    startObserving();
  }

  setupNavigationListener() {
    // Listen for URL changes (YouTube is a single-page app)
    let currentUrl = window.location.href;
    
    const checkForUrlChange = () => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        setTimeout(() => {
          if (this.isWatchPage()) {
            this.cleanPage();
          }
        }, 500);
      }
    };

    // Check for URL changes periodically
    setInterval(checkForUrlChange, 1000);

    // Also listen for popstate events
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        if (this.isWatchPage()) {
          this.cleanPage();
        }
      }, 500);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
    
    // Remove custom elements
    const timeRemaining = document.querySelector('#clean-player-time-remaining');
    if (timeRemaining) timeRemaining.remove();
    
    const qualityShortcut = document.querySelector('#clean-player-quality-shortcut');
    if (qualityShortcut) qualityShortcut.remove();
  }
}

// Initialize the clean player
const cleanPlayer = new YouTubeCleanPlayer();

// Listen for messages from popup
chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    if (cleanPlayer.isEnabled) {
      // Disable - reload page to restore original state
      window.location.reload();
    } else {
      // Enable
      cleanPlayer.cleanPage();
    }
    cleanPlayer.isEnabled = !cleanPlayer.isEnabled;
    sendResponse({ enabled: cleanPlayer.isEnabled });
  }
  
  if (request.action === 'getStatus') {
    sendResponse({ enabled: cleanPlayer.isEnabled });
  }
});
