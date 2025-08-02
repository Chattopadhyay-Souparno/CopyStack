const VALID_KEY = "COPYSTACK-PRO-2025";
const MAX_HISTORY = 100;

class CopyStackPopup {
  constructor() {
    this.clipboardHistory = [];
    this.filteredHistory = [];
    this.isProUnlocked = false;
    this.isDarkMode = false;
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.setupTabs();
    this.renderHistory();
    this.updateProFeatures();
  }

  async loadData() {
    const data = await chrome.storage.local.get(['clipboardHistory', 'proKey', 'darkMode']);
    
    this.clipboardHistory = data.clipboardHistory || [];
    this.filteredHistory = [...this.clipboardHistory];
    this.isProUnlocked = data.proKey === VALID_KEY;
    this.isDarkMode = data.darkMode || false;
    
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    }
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Pro unlock
    document.getElementById('unlock-btn').addEventListener('click', () => this.unlockPro());
    document.getElementById('license-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.unlockPro();
    });

    // Clear all
    document.getElementById('clear-all').addEventListener('click', () => this.clearAll());

    // Search (pro feature)
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => this.filterHistory(e.target.value));

    // Dark mode toggle (pro feature)
    document.getElementById('dark-toggle').addEventListener('click', () => this.toggleDarkMode());

    // Export buttons (pro features)
    document.getElementById('export-md').addEventListener('click', () => this.exportToClipboard('markdown'));
    document.getElementById('export-csv').addEventListener('click', () => this.exportToClipboard('csv'));
    document.getElementById('export-json').addEventListener('click', () => this.exportToClipboard('json'));
  }

  setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
          content.style.display = 'none';
        });
        
        const targetTab = e.target.dataset.tab;
        document.getElementById(`${targetTab}-tab`).style.display = 'block';
      });
    });
  }

  switchTab(tabName) {
    // Tab switching is handled in setupTabs
  }

  renderHistory() {
    const listContainer = document.getElementById('clipboard-list');
    const emptyState = document.getElementById('empty-state');
    
    if (this.filteredHistory.length === 0) {
      emptyState.style.display = 'block';
      listContainer.innerHTML = '';
      listContainer.appendChild(emptyState);
      return;
    }
    
    emptyState.style.display = 'none';
    
    const historyHTML = this.filteredHistory.map((item, index) => `
      <div class="clipboard-item" data-index="${index}">
        <div class="clipboard-text">${this.escapeHtml(item.text)}</div>
        <div class="clipboard-actions">
          <div class="clipboard-meta">${this.formatTime(item.timestamp)}</div>
          <div class="action-btns">
            <button class="icon-btn" onclick="copyStackPopup.copyToClipboard(${index})" title="Copy">
              📋
            </button>
            <button class="icon-btn" onclick="copyStackPopup.deleteItem(${index})" title="Delete">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    listContainer.innerHTML = historyHTML;
  }

  async copyToClipboard(index) {
    const item = this.filteredHistory[index];
    if (item) {
      try {
        await navigator.clipboard.writeText(item.text);
        this.showToast('Copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = item.text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast('Copied to clipboard!');
      }
    }
  }

  async deleteItem(index) {
    const item = this.filteredHistory[index];
    const originalIndex = this.clipboardHistory.findIndex(h => h.id === item.id);
    
    if (originalIndex !== -1) {
      this.clipboardHistory.splice(originalIndex, 1);
      this.filteredHistory = [...this.clipboardHistory];
      
      await chrome.storage.local.set({ clipboardHistory: this.clipboardHistory });
      this.renderHistory();
    }
  }

  async clearAll() {
    if (confirm('Are you sure you want to clear all clipboard history?')) {
      this.clipboardHistory = [];
      this.filteredHistory = [];
      await chrome.storage.local.set({ clipboardHistory: [] });
      this.renderHistory();
    }
  }

  async unlockPro() {
    const inputKey = document.getElementById('license-input').value.trim();
    
    if (inputKey === VALID_KEY) {
      this.isProUnlocked = true;
      await chrome.storage.local.set({ proKey: inputKey });
      this.updateProFeatures();
      this.showToast('Pro features unlocked! 🎉');
      this.switchTab('history');
      document.querySelector('[data-tab="history"]').click();
    } else {
      this.showToast('Invalid license key. Please try again.', true);
      document.getElementById('license-input').value = '';
    }
  }

  updateProFeatures() {
    const searchContainer = document.getElementById('search-container');
    const exportButtons = document.getElementById('export-buttons');
    const darkToggle = document.getElementById('dark-toggle');
    
    if (this.isProUnlocked) {
      searchContainer.classList.add('show');
      exportButtons.classList.add('show');
      darkToggle.classList.add('show');
      
      // Update pro tab content
      const proTab = document.getElementById('pro-tab');
      proTab.innerHTML = `
        <div class="pro-section">
          <div class="pro-icon">✅</div>
          <h3 style="margin-bottom: 8px; color: #22c55e;">Pro Unlocked!</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 20px;">
            You now have access to all pro features
          </p>
          
          <div style="text-align: left; font-size: 12px; color: #666; line-height: 1.6;">
            <h4 style="margin-bottom: 12px; font-size: 14px; text-align: center;">Active Features:</h4>
            <ul>
              <li>🔍 Real-time search through history</li>
              <li>📁 Export to Markdown, CSV, JSON</li>
              <li>🌙 Dark mode toggle</li>
              <li>🏷️ Tag and organize entries</li>
            </ul>
          </div>
          
          <button class="btn danger" onclick="copyStackPopup.resetPro()" style="width: 100%; margin-top: 20px;">
            Reset Pro License
          </button>
        </div>
      `;
    }
  }

  async resetPro() {
    if (confirm('Are you sure you want to reset your pro license?')) {
      this.isProUnlocked = false;
      await chrome.storage.local.remove('proKey');
      location.reload();
    }
  }

  filterHistory(query) {
    if (!this.isProUnlocked) return;
    
    if (!query.trim()) {
      this.filteredHistory = [...this.clipboardHistory];
    } else {
      const lowercaseQuery = query.toLowerCase();
      this.filteredHistory = this.clipboardHistory.filter(item =>
        item.text.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    this.renderHistory();
  }

  async toggleDarkMode() {
    if (!this.isProUnlocked) return;
    
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
    
    await chrome.storage.local.set({ darkMode: this.isDarkMode });
    
    const toggleBtn = document.getElementById('dark-toggle');
    toggleBtn.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  async exportToClipboard(format) {
    if (!this.isProUnlocked) return;
    
    let exportData = '';
    
    switch (format) {
      case 'markdown':
        exportData = this.exportToMarkdown();
        break;
      case 'csv':
        exportData = this.exportToCSV();
        break;
      case 'json':
        exportData = this.exportToJSON();
        break;
    }
    
    try {
      await navigator.clipboard.writeText(exportData);
      this.showToast(`Exported as ${format.toUpperCase()} to clipboard!`);
    } catch (err) {
      console.error('Export failed:', err);
      this.showToast('Export failed. Please try again.', true);
    }
  }

  exportToMarkdown() {
    let md = '# CopyStack Clipboard History\n\n';
    md += `Exported on: ${new Date().toLocaleString()}\n`;
    md += `Total items: ${this.clipboardHistory.length}\n\n`;
    
    this.clipboardHistory.forEach((item, index) => {
      md += `## Entry ${index + 1}\n`;
      md += `**Timestamp:** ${new Date(item.timestamp).toLocaleString()}\n\n`;
      md += '```\n';
      md += item.text + '\n';
      md += '```\n\n';
    });
    
    return md;
  }

  exportToCSV() {
    let csv = 'Index,Timestamp,Text\n';
    
    this.clipboardHistory.forEach((item, index) => {
      const timestamp = new Date(item.timestamp).toLocaleString();
      const text = `"${item.text.replace(/"/g, '""')}"`;
      csv += `${index + 1},"${timestamp}",${text}\n`;
    });
    
    return csv;
  }

  exportToJSON() {
    const exportObj = {
      exportedAt: new Date().toISOString(),
      totalItems: this.clipboardHistory.length,
      items: this.clipboardHistory.map((item, index) => ({
        index: index + 1,
        timestamp: item.timestamp,
        text: item.text,
        id: item.id
      }))
    };
    
    return JSON.stringify(exportObj, null, 2);
  }

  showToast(message, isError = false) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? '#dc2626' : '#22c55e'};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return time.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize popup when DOM is loaded
let copyStackPopup;
document.addEventListener('DOMContentLoaded', () => {
  copyStackPopup = new CopyStackPopup();
});

// Listen for clipboard updates from content script
chrome.runtime.onMessage?.addListener((message, sender, sendResponse) => {
  if (message.type === 'clipboardUpdate') {
    copyStackPopup.loadData().then(() => {
      copyStackPopup.filteredHistory = [...copyStackPopup.clipboardHistory];
      copyStackPopup.renderHistory();
    });
  }
});