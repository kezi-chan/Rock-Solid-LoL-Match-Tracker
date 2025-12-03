# 🗿 Rock-Solid League of Legends Match Tracker
A simple front-end project to test out the Riot API and create a LoL Match Tracker. It served me as a learning resource.

This shows the user's recent matches with statistics, items, spells, stats/min from the Riot API. Similar to well-known sites that use the same method to obtain data.

Project made by me from scratch. Feel free to use it in any ways / however You likes.

## Requirements
- Node.js
- Riot API Key ([Riot Developer Platform](https://developer.riotgames.com/))

## How to setup and use it

1. Clone repo.
2. Take your Developer API Key from [Riot Developer Platform](https://developer.riotgames.com/).
3. Create a `.env` file in directionary -> `lol-match-tracker\.env`:
```
RIOT_API_KEY=RGAPI-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
PORT=3000
REGION=euw1
```
> Your's `RIOT_API_KEY` & `REGION` (examples: `eun1`, `kr1`, `na1`)

4. Run server & proxy in CMD/PowerShell:
```
cd .../lol-match-tracker
npm install
npm start
```
5. Open in the browser:
```
http://localhost:3000
```
## Troubleshot
- `ERR_CONNECTION_REFUSED` _(F12)_ -> make sure npm start is running and the `port 3000` is not used.
- `401` or `403` from Riot -> check `RIOT_API_KEY` in `.env`.

## Images
![Preview 1](/images/lolmt1.png "View of site")


![Preview 1](/images/lolmt2.png "View of site with Summoner's recent matches")


![Preview 3](/images/lolmt3.png "View of site with Summoner's recent matches")
