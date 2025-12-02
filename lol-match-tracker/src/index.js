import { getPuuidByName, getRecentMatches, getMatchDetails } from './scripts/api.js';
import { formatDate, formatDuration, formatKDA, getKDAColor, getPerMinute, getItemIconUrl, getSummonerSpellIconUrl, getChampionIconUrl } from './scripts/utils.js';

const summonerInput = document.getElementById('summoner-name');
const fetchButton = document.getElementById('fetch-matches');
const matchesList = document.getElementById('matches-list');

const themeToggle = document.getElementById('theme-toggle');
function applyTheme(t) {
  if (t === 'dark') document.body.classList.add('dark-theme');
  else document.body.classList.remove('dark-theme');
  if (themeToggle) themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
}
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

fetchButton.addEventListener('click', async () => {
  const summonerNameRaw = summonerInput.value.trim();
  if (!summonerNameRaw) {
    matchesList.innerHTML = '<p>Wpisz nazwę w formacie Summoner#TAG</p>';
    return;
  }

  const [name, tag] = summonerNameRaw.split('#');
  if (!tag) {
    matchesList.innerHTML = '<p>Użyj formatu: Nazwa#TAG</p>';
    return;
  }

  matchesList.innerHTML = '<p>Loading...</p>';

  try {
    const puuidResp = await getPuuidByName(name, tag);
    const puuid = puuidResp?.puuid || puuidResp;
    if (!puuid) {
      matchesList.innerHTML = '<p>Nie znaleziono puuid dla tego gracza.</p>';
      return;
    }

    const matchIds = await getRecentMatches(puuid, 10);
    if (!Array.isArray(matchIds) || matchIds.length === 0) {
      matchesList.innerHTML = '<p>Brak ostatnich meczów do wyświetlenia.</p>';
      return;
    }

    const results = await Promise.allSettled(matchIds.map(id => getMatchDetails(id)));
    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    if (successful.length === 0) {
      matchesList.innerHTML = '<p>Nie udało się pobrać szczegółów meczów.</p>';
      console.error(results);
      return;
    }

    await displayMatches(successful, name, puuid);
  } catch (err) {
    console.error('Error fetching matches flow:', err);
    matchesList.innerHTML = `<p>Błąd: ${err.message || err}</p>`;
  }
});

async function displayMatches(matches, summonerName, puuid) {
  matchesList.innerHTML = '';
  for (const match of matches) {
    const participant = match?.info?.participants?.find(p =>
      (p.puuid && puuid && p.puuid === puuid) ||
      (p.summonerName && summonerName && p.summonerName.toLowerCase() === summonerName.toLowerCase())
    );

    const el = document.createElement('div');
    el.className = 'match-card';

    if (!participant) {
      el.innerHTML = `<p>Nie znaleziono uczestnika w meczu ${match.metadata?.matchId || ''}</p>`;
      matchesList.appendChild(el);
      continue;
    }

    const cs = (participant.totalMinionsKilled || 0) + (participant.neutralMinionsKilled || 0);
    const gameDuration = match.info.gameDuration;
    
    // per minute values
    const csPerMin = getPerMinute(cs, gameDuration);
    const goldPerMin = getPerMinute(participant.goldEarned ?? 0, gameDuration);
    const dmgPerMin = getPerMinute(participant.totalDamageDealtToChampions ?? 0, gameDuration);
    const visionPerMin = getPerMinute(participant.visionScore ?? 0, gameDuration);

    const items = [];
    for (let i = 0; i <= 6; i++) {
      const key = 'item' + i;
      if (participant[key]) items.push(participant[key]);
    }

    const headerText = participant.championName + (participant.summonerName ? ` — ${participant.summonerName}` : '');
    const kdaColor = getKDAColor(participant.kills, participant.deaths, participant.assists);

    const itemIconPromises = items.map(id => getItemIconUrl(id));
    const [itemIcons, spell1Url, spell2Url, champIconUrl] = await Promise.all([
      Promise.all(itemIconPromises),
      getSummonerSpellIconUrl(participant.summoner1Id),
      getSummonerSpellIconUrl(participant.summoner2Id),
      getChampionIconUrl(participant.championName)
    ]);

    const itemsHtml = itemIcons.length
      ? itemIcons.map(url => url ? `<img class="item-icon" src="${url}" alt="item">` : '').join('')
      : '-';

    const spellsHtml = [
      spell1Url ? `<img class="spell-icon" src="${spell1Url}" alt="spell1">` : '',
      spell2Url ? `<img class="spell-icon" src="${spell2Url}" alt="spell2">` : ''
    ].join(' ');

    el.innerHTML = `
      <div class="match-card-header">
        <div class="champion-header">
          ${champIconUrl ? `<img class="champion-icon" src="${champIconUrl}" alt="${participant.championName}">` : ''}
          <h3>${headerText}</h3>
        </div>
        <div class="match-meta">
          <span class="result ${participant.win ? 'win' : 'loss'}">${participant.win ? 'Win' : 'Loss'}</span>
          <span class="duration">${formatDuration(match.info.gameDuration)}</span>
          <span class="date">${formatDate(match.info.gameCreation)}</span>
        </div>
      </div>

      <div class="match-body">
        <div class="col-left">
          <p style="color: ${kdaColor};">⚔️ <strong>K/D/A:</strong> ${formatKDA(participant.kills, participant.deaths, participant.assists)}</p>
          <p>🌾 <strong>CS:</strong> ${cs} | <span class="per-min">${csPerMin}/min</span></p>
          <p>🪙 <strong>Gold:</strong> ${(participant.goldEarned ?? 0).toLocaleString()} | <span class="per-min">${goldPerMin}/min</span></p>
          <p>⭐ <strong>Level:</strong> ${participant.champLevel ?? '-'}</p>
        </div>
        <div class="col-right">
          <p>💥 <strong>Damage to champs:</strong> ${(participant.totalDamageDealtToChampions ?? 0).toLocaleString()} | <span class="per-min">${dmgPerMin}/min</span></p>
          <p>👁️ <strong>Vision:</strong> ${participant.visionScore ?? '-'} | <span class="per-min">${visionPerMin}/min</span></p>
          <p>🎯 <strong>Role/Lane:</strong> ${participant.teamPosition ?? participant.lane ?? '-'}</p>
          <p>🪄 <strong>Spells:</strong> ${spellsHtml}</p>
          <p>⚙️ <strong>Items:</strong> ${itemsHtml}</p>
        </div>
      </div>
    `;
    matchesList.appendChild(el);
  }
}