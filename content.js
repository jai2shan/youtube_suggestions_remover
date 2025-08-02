// YouTube Clean Player - Content Script
// This script removes all distractions and shows only the video player

class YouTubeCleanPlayer {
  constructor() {
    this.isEnabled = true;
    this.originalTitle = document.title;
    this.observer = null;
    this.init();
  }

  init() {
    // Wait for the page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.cleanPage());
    } else {
      this.cleanPage();
    }

    // Set up mutation observer to handle dynamic content
    this.setupObserver();
    
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
    }, 500);
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

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
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
