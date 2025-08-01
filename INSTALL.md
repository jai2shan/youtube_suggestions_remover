# Installation and Usage Instructions

## Quick Setup

1. **Load the Extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `youtube_suggestions_remover` folder
   - The extension will appear in your extensions list

2. **Create Icons (Optional):**
   Since Chrome requires PNG icons, you can either:
   - Use online SVG to PNG converters for the SVG files created
   - Or temporarily use any 16x16, 32x32, 48x48, and 128x128 PNG images
   - Place them in the `icons/` folder as `icon16.png`, `icon32.png`, etc.

3. **Test the Extension:**
   - Go to any YouTube video (e.g., youtube.com/watch?v=...)
   - Click the extension icon in Chrome toolbar
   - Click "Enable Clean Mode"
   - The page should now show only the video player!

## What the Extension Does

- **Removes YouTube clutter:** suggestions, comments, sidebar, navigation
- **Shows only the video:** Clean, distraction-free viewing
- **Toggle on/off:** Easy control via popup
- **Works automatically:** Handles YouTube's dynamic loading

## Files Created

- `manifest.json` - Extension configuration
- `content.js` - Main script that cleans the page
- `styles.css` - CSS to hide unwanted elements
- `popup.html` & `popup.js` - Extension popup interface
- `README.md` - Documentation
- `icons/` folder - For extension icons

The extension is ready to use! Just load it in Chrome and enjoy distraction-free YouTube videos.
