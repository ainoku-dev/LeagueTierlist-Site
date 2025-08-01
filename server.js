const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const skins = JSON.parse(fs.readFileSync(path.join(__dirname, 'skins_for_repo.json')));
const USERS = ['User1', 'User2', 'User3', 'User4'];

const syncState = {
  enabled: false,
  current: null,
  waiting: new Set(),
  participants: new Set(),
};

function pickRandomSkin() {
  return skins[Math.floor(Math.random() * skins.length)];
}

app.post('/api/sync/toggle', (req, res) => {
  const { enabled, user } = req.body;
  if (enabled) {
    if (!syncState.enabled) {
      syncState.enabled = true;
      syncState.current = pickRandomSkin();
      syncState.participants = new Set([user]);
      syncState.waiting = new Set([user]);
    } else {
      syncState.participants.add(user);
      syncState.waiting.add(user);
    }
  } else {
    syncState.participants.delete(user);
    syncState.waiting.delete(user);
    if (syncState.participants.size === 0) {
      syncState.enabled = false;
      syncState.current = null;
      syncState.waiting.clear();
    }
  }
  res.json({ enabled: syncState.enabled });
});

app.get('/api/sync/current', (req, res) => {
  if (!syncState.enabled) return res.json({ enabled: false });
  res.json({ enabled: true, skin: syncState.current, waitingFor: Array.from(syncState.waiting) });
});

app.post('/api/sync/rate', (req, res) => {
  if (!syncState.enabled) return res.json({ enabled: false });
  const { user } = req.body;
  syncState.waiting.delete(user);
  if (syncState.waiting.size === 0) {
    syncState.current = pickRandomSkin();
    syncState.waiting = new Set(syncState.participants);
    return res.json({ enabled: true, nextSkin: syncState.current });
  }
  res.json({ enabled: true, waiting: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
