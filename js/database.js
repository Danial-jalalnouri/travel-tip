/**
 * Database Abstraction Layer
 * Uses Firebase Firestore
 */

const firebaseConfig = {
  apiKey: "AIzaSyAHLmD3BXJ608tA6YfehrmsFf_5kD7kx9Y",
  authDomain: "travel-tip-3a3f1.firebaseapp.com",
  projectId: "travel-tip-3a3f1",
  storageBucket: "travel-tip-3a3f1.firebasestorage.app",
  messagingSenderId: "578956384628",
  appId: "1:578956384628:web:46373c7ae209c122e67421",
  measurementId: "G-97TFRRTS2X"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const DB = {
  async init() {},

  async addTip(tip) {
    const docRef = await db.collection('tips').add({
      country: tip.country,
      city: tip.city,
      date: tip.date,
      description: tip.description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...tip };
  },

  async getAllTips() {
    const snapshot = await db.collection('tips').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getTipById(id) {
    const doc = await db.collection('tips').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async searchTips(filters = {}) {
    let query = db.collection('tips');

    const snapshot = await query.get();
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
      results = results.filter(tip =>
        new Date(tip.date) >= new Date(filters.afterDate)
      );
    }

    results.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });

    return results;
  },

  async updateTip(id, updates) {
    await db.collection('tips').doc(id).update(updates);
    return { id, ...updates };
  },

  async deleteTip(id) {
    await db.collection('tips').doc(id).delete();
    return true;
  }
};

export default DB;