const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Helper to read db.json
function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper to write db.json
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// GET - Get all tips
app.get('/api/tips', (req, res) => {
  const db = readDB();
  res.json(db.tips);
});

// POST - Add a new tip
app.post('/api/tips', (req, res) => {
  const db = readDB();
  const newTip = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    country: req.body.country,
    city: req.body.city,
    date: req.body.date,
    description: req.body.description,
    createdAt: new Date().toISOString()
  };
  db.tips.push(newTip);
  writeDB(db);
  res.json(newTip);
});

// PUT - Update a tip
app.put('/api/tips/:id', (req, res) => {
  const db = readDB();
  const index = db.tips.findIndex(tip => tip.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tip not found' });
  }
  db.tips[index] = { ...db.tips[index], ...req.body };
  writeDB(db);
  res.json(db.tips[index]);
});

// DELETE - Delete a tip
app.delete('/api/tips/:id', (req, res) => {
  const db = readDB();
  const index = db.tips.findIndex(tip => tip.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tip not found' });
  }
  db.tips.splice(index, 1);
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});