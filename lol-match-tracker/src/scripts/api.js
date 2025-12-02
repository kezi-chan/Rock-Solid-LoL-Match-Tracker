// This file contains functions for interacting with the Riot Games API.
// It includes methods for fetching match data based on a selected user.

const BASE = window.location.origin || 'http://localhost:3000'; // use server serving static + api

/**
 * Get player PUUID by gameName and tagLine
 * @param {string} gameName - Player game name
 * @param {string} tagLine - Player tag line
 * @returns {Promise<string>} Player PUUID
 */
async function getPuuidByName(gameName, tagLine) {
  const resp = await fetch(`${BASE}/api/puuid?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}`);
  if (!resp.ok) throw new Error('Failed to fetch puuid: ' + resp.status);
  const data = await resp.json();
  return data.puuid || data.puuid; // zwraca puuid z odpowiedzi serwera
}

/**
 * Get recent matches for a player
 * @param {string} puuid - Player PUUID
 * @param {number} count - Number of matches to fetch
 * @returns {Promise<Array>} Array of match IDs
 */
async function getRecentMatches(puuid, count = 20) {
  const resp = await fetch(`${BASE}/api/matches/${encodeURIComponent(puuid)}?count=${count}`);
  if (!resp.ok) throw new Error('Failed to fetch matches: ' + resp.status);
  return resp.json();
}

/**
 * Get detailed match data
 * @param {string} matchId - Match ID
 * @returns {Promise<Object>} Match details
 */
async function getMatchDetails(matchId) {
  const resp = await fetch(`${BASE}/api/match/${encodeURIComponent(matchId)}`);
  if (!resp.ok) throw new Error('Failed to fetch match details: ' + resp.status);
  return resp.json();
}

export { getPuuidByName, getRecentMatches, getMatchDetails };