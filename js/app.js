import DB from './database.js';

class TravelTipsApp {
  constructor() {
    this.tips = [];
    this.init();
  }

  async init() {
    await DB.init();
    this.bindEvents();
    await this.loadTips();
  }

  bindEvents() {
    // Form submission
    document.getElementById('tipForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTip();
    });

    // Search
    document.getElementById('searchBtn').addEventListener('click', () => {
      this.searchTips();
    });

    document.getElementById('clearSearchBtn').addEventListener('click', () => {
      this.clearSearch();
    });

    // Modal
    document.querySelector('.close-modal').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('editForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveEdit();
    });

    // Close modal on outside click
    document.getElementById('editModal').addEventListener('click', (e) => {
      if (e.target.id === 'editModal') {
        this.closeModal();
      }
    });
  }

  async loadTips(filters = {}) {
    this.tips = await DB.searchTips(filters);
    this.renderTips();
  }

  async addTip() {
    const country = document.getElementById('country').value.trim();
    const city = document.getElementById('city').value.trim();
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value.trim();

    if (!country || !city || !date || !description) {
      alert('Please fill in all fields');
      return;
    }

    await DB.addTip({ country, city, date, description });
    document.getElementById('tipForm').reset();
    await this.loadTips();
  }

  async searchTips() {
    const filters = {};

    const country = document.getElementById('searchCountry').value.trim();
    const city = document.getElementById('searchCity').value.trim();
    const afterDate = document.getElementById('searchAfterDate').value;
    const description = document.getElementById('searchDescription').value.trim();

    if (country) filters.country = country;
    if (city) filters.city = city;
    if (afterDate) filters.afterDate = afterDate;
    if (description) filters.description = description;

    await this.loadTips(filters);
  }

  clearSearch() {
    document.getElementById('searchCountry').value = '';
    document.getElementById('searchCity').value = '';
    document.getElementById('searchAfterDate').value = '';
    document.getElementById('searchDescription').value = '';
    this.loadTips();
  }

  renderTips() {
    const container = document.getElementById('tipsList');
    const countEl = document.getElementById('tipCount');

    countEl.textContent = `(${this.tips.length} tips)`;

    if (this.tips.length === 0) {
      container.innerHTML = '<div class="no-tips">No travel tips found. Be the first to share!</div>';
      return;
    }

    container.innerHTML = this.tips.map(tip => `
      <div class="tip-card" data-id="${tip.id}">
        <div class="tip-header">
          <div class="tip-location">${this.escapeHtml(tip.city)}, ${this.escapeHtml(tip.country)}</div>
          <div class="tip-date">${this.formatDate(tip.date)}</div>
        </div>
        <div class="tip-description">${this.escapeHtml(tip.description)}</div>
        <div class="tip-actions">
          <button class="btn btn-small btn-edit" onclick="app.editTip('${tip.id}')">Edit</button>
          <button class="btn btn-small btn-delete" onclick="app.deleteTip('${tip.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async editTip(id) {
    const tip = await DB.getTipById(id);
    if (!tip) return;

    document.getElementById('editId').value = tip.id;
    document.getElementById('editCountry').value = tip.country;
    document.getElementById('editCity').value = tip.city;
    document.getElementById('editDate').value = tip.date;
    document.getElementById('editDescription').value = tip.description;

    document.getElementById('editModal').classList.remove('hidden');
  }

  async saveEdit() {
    const id = document.getElementById('editId').value;
    const updates = {
      country: document.getElementById('editCountry').value.trim(),
      city: document.getElementById('editCity').value.trim(),
      date: document.getElementById('editDate').value,
      description: document.getElementById('editDescription').value.trim()
    };

    await DB.updateTip(id, updates);
    this.closeModal();
    await this.loadTips();
  }

  async deleteTip(id) {
    if (confirm('Are you sure you want to delete this tip?')) {
      await DB.deleteTip(id);
      await this.loadTips();
    }
  }

  closeModal() {
    document.getElementById('editModal').classList.add('hidden');
  }
}

const app = new TravelTipsApp();
window.app = app;