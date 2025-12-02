// Pomocnicze funkcje dla aplikacji śledzącej mecze League of Legends

// Funkcja do formatowania daty
export function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('pl-PL', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// Funkcja do obsługi błędów
export function handleError(error) {
    console.error('An error occurred:', error);
    alert('Something went wrong. Please try again later.');
}

// Funkcja do obliczania win rate
export function calculateWinRate(matches) {
    const totalMatches = matches.length;
    const wins = matches.filter(match => match.result === 'win').length;
    return totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
}

// Funkcja do formatowania czasu trwania meczu
export function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '-';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

// Funkcja do obliczania minut z sekund
export function getDurationMinutes(seconds) {
    if (!seconds && seconds !== 0) return 0;
    return Math.floor(seconds / 60);
}

// Funkcja VPM
export function getPerMinute(value, durationSeconds) {
    if (!durationSeconds || durationSeconds === 0) return 0;
    const minutes = getDurationMinutes(durationSeconds);
    if (minutes === 0) return 0;
    return (value / minutes).toFixed(1);
}

// Funkcja format KDA
export function formatKDA(kills, deaths, assists) {
    const kda = deaths === 0 ? (kills + assists) : ((kills + assists) / deaths);
    return `${kills}/${deaths}/${assists} (${kda.toFixed(2)} KDA)`;
}

// Funkcja do KDA
export function getKDAColor(kills, deaths, assists) {
    const kda = deaths === 0 ? (kills + assists) : ((kills + assists) / deaths);
    
    if (kda < 1.00) return '#ff6b6b';       // czerwony
    if (kda < 3.00) return '#5eb3f6';       // jasnoniebieski
    if (kda < 5.00) return '#1ec17b';       // zielony
    return '#ffd700';                       // złoty
}

// Data Dragon utilities
let ddVersionCache = null;
let summonerSpellDataCache = null;
let championDataCache = null;

async function fetchDDragonVersion() {
    if (ddVersionCache) return ddVersionCache;
    try {
        const resp = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await resp.json();
        ddVersionCache = versions && versions.length ? versions[0] : '13.1.1';
    } catch (e) {
        ddVersionCache = '13.1.1';
    }
    return ddVersionCache;
}

async function fetchSummonerSpellData() {
    if (summonerSpellDataCache) return summonerSpellDataCache;
    try {
        const ver = await fetchDDragonVersion();
        const resp = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/en_US/summoner.json`);
        const json = await resp.json();
        summonerSpellDataCache = json?.data || {};
    } catch (e) {
        summonerSpellDataCache = {};
    }
    return summonerSpellDataCache;
}

async function fetchChampionData() {
    if (championDataCache) return championDataCache;
    try {
        const ver = await fetchDDragonVersion();
        const resp = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/en_US/champion.json`);
        const json = await resp.json();
        championDataCache = json?.data || {};
    } catch (e) {
        championDataCache = {};
    }
    return championDataCache;
}

export async function getItemIconUrl(itemId) {
    if (!itemId || Number(itemId) === 0) return '';
    const ver = await fetchDDragonVersion();
    return `https://ddragon.leagueoflegends.com/cdn/${ver}/img/item/${itemId}.png`;
}

export async function getSummonerSpellIconUrl(summonerId) {
    if (!summonerId && summonerId !== 0) return '';
    const ver = await fetchDDragonVersion();
    const spells = await fetchSummonerSpellData();
    const found = Object.values(spells).find(s => s.key === String(summonerId));
    if (!found) return '';
    return `https://ddragon.leagueoflegends.com/cdn/${ver}/img/spell/${found.image.full}`;
}

export async function getChampionIconUrl(championName) {
    if (!championName) return '';
    const ver = await fetchDDragonVersion();
    return `https://ddragon.leagueoflegends.com/cdn/${ver}/img/champion/${championName}.png`;
}