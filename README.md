# YouTube Clean Player - Chrome Extension

A Chrome extension that removes all distractions from YouTube and shows only the video player for a focused viewing experience.

## Features

- ✅ **Clean Interface**: Removes all YouTube distractions including:
  - Sidebar suggestions
  - Comments section
  - Related videos
  - Cards and end screens
  - Navigation header
  - Description and metadata
  
- 🎬 **Video-Only Focus**: Shows only the video player and essential controls
- 🎯 **Toggle Control**: Easy on/off toggle via extension popup
- 🔄 **Dynamic Updates**: Works with YouTube's single-page navigation
- 📱 **Responsive**: Works in theater mode and fullscreen

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

### From Chrome Web Store
*Coming soon...*

## Usage

1. Navigate to any YouTube video page
2. Click the extension icon in your Chrome toolbar
3. Click "Enable Clean Mode" to activate
4. Enjoy distraction-free video watching!
5. Click "Disable Clean Mode" to return to normal YouTube

## How It Works

The extension uses:
- **Content Scripts**: Automatically injected into YouTube pages
- **CSS Injection**: Hides unwanted elements
- **DOM Manipulation**: Dynamically removes distractions
- **Mutation Observer**: Handles YouTube's dynamic content loading

## File Structure

```
youtube_suggestions_remover/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── styles.css            # CSS for hiding elements
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons
└── README.md            # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `activeTab` (minimal permissions for security)
- **Target**: YouTube.com pages only
- **Compatibility**: Chrome, Edge, and other Chromium-based browsers

## Development

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes on YouTube

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different YouTube pages
5. Submit a pull request

## Troubleshooting

### Extension Not Working
- Ensure you're on a YouTube watch page (`youtube.com/watch?v=...`)
- Try refreshing the YouTube page
- Check if the extension is enabled in Chrome

### Elements Still Visible
- Some elements may load dynamically - give it a moment
- Try toggling the extension off and on again
- Report persistent issues with specific video URLs

### Performance Issues
- The extension is designed to be lightweight
- If you experience slowdowns, try disabling other extensions temporarily

## Privacy

This extension:
- ✅ Only runs on YouTube pages
- ✅ Does not collect any user data
- ✅ Does not track browsing history
- ✅ Works entirely locally in your browser
- ✅ No external network requests

## License

MIT License - feel free to modify and distribute.

## Version History

### v1.0.0
- Initial release
- Basic distraction removal
- Popup toggle interface
- Dynamic content handling

## Support

If you encounter any issues or have suggestions:
1. Check the troubleshooting section above
2. Create an issue on the GitHub repository
3. Provide details about your browser version and the specific problem

---

**Enjoy your distraction-free YouTube experience! 🎬**
