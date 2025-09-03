const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_PATH  = path.join(DATA_DIR, 'data.json');
const FEEDBACK_PATH = path.join(DATA_DIR, "feedback.json");

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ status: 'close', lastUpdated: null }, null, 2));
  }

  if (!fs.existsSync(FEEDBACK_PATH)) {
    fs.writeFileSync(FEEDBACK_PATH, JSON.stringify({ helpful: 0, wrong: 0 }, null, 2));
  }
}
ensureDb();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to read status' });
  }
});

app.post('/api/status', (req, res) => {
  try {
    const allowed = ['open', 'busy', 'close'];
    const { status } = req.body || {};
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const data = { status, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to write status' });
  }
});

app.post("/api/feedback", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FEEDBACK_PATH, "utf8"));
    if (req.body.type === "helpful") data.helpful++;
    if (req.body.type === "wrong") data.wrong++;
    fs.writeFileSync(FEEDBACK_PATH, JSON.stringify(data, null, 2));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

app.get('/api/feedback', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FEEDBACK_PATH, 'utf8'));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to read feedback" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
