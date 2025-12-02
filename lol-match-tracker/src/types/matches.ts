interface Match {
    gameId: string;
    champion: number;
    queue: number;
    season: number;
    timestamp: number;
    role: string;
    lane: string;
    win: boolean;
    kills: number;
    deaths: number;
    assists: number;
    totalDamageDealt: number;
    goldEarned: number;
    items: number[];
}

interface PlayerMatchHistory {
    matches: Match[];
    totalGames: number;
    startIndex: number;
    endIndex: number;
}