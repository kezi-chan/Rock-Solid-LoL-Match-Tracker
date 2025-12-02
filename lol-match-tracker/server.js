const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'src')));

const API_KEY = process.env.RIOT_API_KEY;
const REGION = process.env.REGION || 'europe';

if (!API_KEY) {
  console.error('Missing API_KEY in .env');
  process.exit(1);
}

const REGION_HOST = 'europe.api.riotgames.com';

app.get('/api/puuid', async (req, res) => {
  const { name, tag } = req.query;
  if (!name || !tag) return res.status(400).json({ error: 'name and tag required' });

  try {
    const url = `https://${REGION_HOST}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    const response = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
    return res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    return res.status(status).json({ error: err.response?.data || err.message });
  }
});

app.get('/api/matches/:puuid', async (req, res) => {
  const { puuid } = req.params;
  const count = req.query.count || 10;
  try {
    const url = `https://${REGION_HOST}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${count}`;
    const response = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
    return res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    return res.status(status).json({ error: err.response?.data || err.message });
  }
});

app.get('/api/match/:matchId', async (req, res) => {
  const { matchId } = req.params;
  try {
    const url = `https://${REGION_HOST}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
    const response = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
    return res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    return res.status(status).json({ error: err.response?.data || err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API proxy running on http://localhost:${PORT}`));