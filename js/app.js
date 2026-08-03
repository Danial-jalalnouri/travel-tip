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
    document.getElementById('tipForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTip();
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      this.searchTips();
    });

    document.getElementById('clearSearchBtn').addEventListener('click', () => {
      this.clearSearch();
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
}

const app = new TravelTipsApp();
window.app = app;