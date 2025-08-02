# 🚀 CopyStack Chrome Extension - Installation Guide

## Quick Start

1. **Download the Extension**
   - Copy all files from the `/chrome-extension/` folder to your computer

2. **Load in Chrome**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the folder containing the extension files

3. **Start Using**
   - The CopyStack icon will appear in your Chrome toolbar
   - Copy any text on any website - it's automatically saved!
   - Click the icon to view your clipboard history

## 🔓 Unlock Pro Features

1. Click the CopyStack extension icon
2. Switch to the "Pro Features" tab
3. Enter license key: `COPYSTACK-PRO-2025`
4. Click "🔓 Unlock Pro"

### Pro Features Include:
- 🔍 Real-time search through clipboard history
- 📁 Export to Markdown, CSV, and JSON formats
- 🌙 Dark mode toggle
- 🏷️ Enhanced organization features

## 📁 File Structure

```
chrome-extension/
├── manifest.json       # Extension configuration
├── popup.html         # Main popup interface
├── popup.js          # Popup functionality
├── content.js        # Content script for clipboard tracking
├── demo.html         # Demo/preview page
├── README.md         # Detailed documentation
└── INSTALL.md        # This installation guide
```

## 🔧 How It Works

1. **Content Script**: Runs on all websites and monitors copy events (Ctrl+C, right-click copy)
2. **Background Storage**: Uses Chrome's local storage to save up to 100 clipboard entries
3. **Popup Interface**: Provides a clean UI to view, search, copy, and manage history
4. **Pro Features**: Unlocked with license key validation

## 🔒 Privacy & Security

- ✅ All data stored locally in your browser
- ✅ No external servers or tracking
- ✅ No data collection or analytics
- ✅ Works completely offline
- ✅ Only requires minimal permissions (storage + active tab)

## 🐛 Troubleshooting

**Extension not appearing:**
- Make sure Developer mode is enabled
- Refresh the extensions page
- Check that all files are in the same folder

**Clipboard not tracking:**
- Try refreshing the webpage
- Ensure you're actually copying text (Ctrl+C or right-click copy)
- Check Chrome's console for any errors

**Pro features not working:**
- Verify license key: `COPYSTACK-PRO-2025`
- Make sure the key is entered exactly (case-sensitive)
- Refresh the extension popup

## 💡 Usage Tips

- The extension automatically prevents duplicate entries
- History is sorted by most recent first
- Search works on the full text content (Pro feature)
- Export functions copy formatted data to your clipboard
- Dark mode preference is saved between sessions

---

**Created with modern web technologies and privacy-first design principles.**