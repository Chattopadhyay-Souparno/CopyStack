// CopyStack Content Script - Tracks clipboard copy events
class CopyStackTracker {
  constructor() {
    this.lastClipboardText = '';
    this.init();
  }

  init() {
    this.setupClipboardTracking();
  }

  setupClipboardTracking() {
    // Track copy events using keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        // Small delay to ensure clipboard is updated
        setTimeout(() => this.checkClipboard(), 100);
      }
    });

    // Track copy events from context menu (right-click copy)
    document.addEventListener('copy', (e) => {
      setTimeout(() => this.checkClipboard(), 100);
    });

    // Track text selection for potential copying
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      if (selection.toString().trim()) {
        // Store the selected text temporarily
        this.selectedText = selection.toString().trim();
      }
    });
  }

  async checkClipboard() {
    try {
      // Try to read from clipboard
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText && clipboardText !== this.lastClipboardText) {
          this.addToHistory(clipboardText);
          this.lastClipboardText = clipboardText;
        }
      } else {
        // Fallback: use the selected text if available
        if (this.selectedText && this.selectedText !== this.lastClipboardText) {
          this.addToHistory(this.selectedText);
          this.lastClipboardText = this.selectedText;
        }
      }
    } catch (err) {
      // Clipboard access might be denied, use fallback
      if (this.selectedText && this.selectedText !== this.lastClipboardText) {
        this.addToHistory(this.selectedText);
        this.lastClipboardText = this.selectedText;
      }
    }
  }

  async addToHistory(text) {
    if (!text || text.trim().length === 0) return;
    
    const trimmedText = text.trim();
    if (trimmedText.length > 10000) {
      // Skip very long texts to avoid storage issues
      return;
    }

    try {
      // Get current history
      const data = await chrome.storage.local.get(['clipboardHistory']);
      let history = data.clipboardHistory || [];

      // Check if this text already exists (avoid duplicates)
      const existingIndex = history.findIndex(item => item.text === trimmedText);
      
      if (existingIndex !== -1) {
        // Move existing item to top
        const existingItem = history.splice(existingIndex, 1)[0];
        existingItem.timestamp = Date.now();
        history.unshift(existingItem);
      } else {
        // Add new item to top
        const newItem = {
          id: this.generateId(),
          text: trimmedText,
          timestamp: Date.now(),
          source: window.location.hostname || 'unknown'
        };
        history.unshift(newItem);
      }

      // Keep only last 100 items
      if (history.length > 100) {
        history = history.slice(0, 100);
      }

      // Save updated history
      await chrome.storage.local.set({ clipboardHistory: history });
      
      // Notify popup about the update
      chrome.runtime.sendMessage?.({
        type: 'clipboardUpdate',
        text: trimmedText
      });

    } catch (err) {
      console.error('CopyStack: Failed to save clipboard item:', err);
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Initialize tracker when content script loads
if (typeof window !== 'undefined') {
  const copyStackTracker = new CopyStackTracker();
}