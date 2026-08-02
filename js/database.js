/**
 * Database Abstraction Layer
 * Currently uses local server API with db.json
 * Later will be replaced with Firebase Firestore
 */

const API_URL = 'http://localhost:3000/api';

const DB = {
  tips: [],

  async init() {
    await this.load();
  },

  async load() {
    try {
      const response = await fetch(`${API_URL}/tips`);
      this.tips = await response.json();
    } catch (error) {
      console.error('Error loading database:', error);
      this.tips = [];
    }
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // CREATE - Add a new tip
  async addTip(tip) {
    const response = await fetch(`${API_URL}/tips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tip)
    });
    const newTip = await response.json();
    this.tips.push(newTip);
    return newTip;
  },

  // READ - Get all tips
  async getAllTips() {
    await this.load();
    return [...this.tips];
  },

  // READ - Get tip by ID
  async getTipById(id) {
    return this.tips.find(tip => tip.id === id);
  },

  // READ - Search tips
  async searchTips(filters = {}) {
    await this.load();
    let results = [...this.tips];

    if (filters.country) {
      const country = filters.country.toLowerCase();
      results = results.filter(tip =>
        tip.country.toLowerCase().includes(country)
      );
    }

    if (filters.city) {
      const city = filters.city.toLowerCase();
      results = results.filter(tip =>
        tip.city.toLowerCase().includes(city)
      );
    }

    if (filters.description) {
      const desc = filters.description.toLowerCase();
      results = results.filter(tip =>
        tip.description.toLowerCase().includes(desc)
      );
    }

    if (filters.afterDate) {
      const afterDate = new Date(filters.afterDate);
      results = results.filter(tip =>
        new Date(tip.date) >= afterDate
      );
    }

    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    return results;
  },

  // UPDATE - Update a tip
  async updateTip(id, updates) {
    const response = await fetch(`${API_URL}/tips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const updated = await response.json();
    const index = this.tips.findIndex(tip => tip.id === id);
    if (index !== -1) {
      this.tips[index] = updated;
    }
    return updated;
  },

  // DELETE - Delete a tip
  async deleteTip(id) {
    await fetch(`${API_URL}/tips/${id}`, { method: 'DELETE' });
    this.tips = this.tips.filter(tip => tip.id !== id);
    return true;
  }
};

export default DB;