# CopyStack - Clipboard History Chrome Extension

A powerful Chrome extension that tracks and manages your clipboard history with advanced pro features.

## Features

### Free Features
- ✅ Track up to 100 clipboard entries
- ✅ Copy and delete individual entries
- ✅ Clear all history
- ✅ Automatic duplicate prevention
- ✅ Modern UI with monospace font

### Pro Features (License Key: `COPYSTACK-PRO-2025`)
- 🔍 Real-time search through clipboard history
- 📁 Export to Markdown, CSV, and JSON formats
- 🌙 Dark mode toggle
- 🏷️ Enhanced organization features

## Installation

1. Download or clone this extension folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The CopyStack extension will appear in your toolbar

## Usage

1. **Basic Usage**: Copy any text on any website - it will automatically be saved to your clipboard history
2. **Access History**: Click the CopyStack icon in your browser toolbar to view your clipboard history
3. **Copy Items**: Click the 📋 button next to any entry to copy it to your clipboard
4. **Delete Items**: Click the 🗑️ button to remove individual entries
5. **Clear All**: Use the "Clear All" button to remove all history

## Pro Features

To unlock pro features:

1. Click the "Pro Features" tab in the extension popup
2. Enter the license key: `COPYSTACK-PRO-2025`
3. Click "🔓 Unlock Pro"

Once unlocked, you'll have access to:
- Search functionality in the History tab
- Export buttons (Markdown, CSV, JSON) - exported data is copied to clipboard
- Dark mode toggle
- Enhanced UI features

## Technical Details

### Files Structure
- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html` - Main popup interface with embedded CSS
- `popup.js` - Popup logic and pro features
- `content.js` - Content script that tracks copy events across all websites
- `README.md` - This documentation file

### Storage
- Uses `chrome.storage.local` for persistence
- Stores up to 100 clipboard entries
- Maintains pro license key and user preferences
- No data is sent to external servers

### Browser Compatibility
- Requires Chrome/Chromium with Manifest V3 support
- Uses modern clipboard API with fallbacks for older browsers
- Responsive design works on different screen sizes

## Privacy

- All data is stored locally in your browser
- No data is transmitted to external servers
- No tracking or analytics
- No permissions beyond storage and active tab access

## License

This extension is created as a demonstration project. The pro features are unlocked with the key `COPYSTACK-PRO-2025` for testing purposes.