# 🗿 Rock-Solid League of Legends Match Tracker
A simple front-end project to test out the Riot API and create a LoL Match Tracker. It served me as a learning resource.

This shows the user's recent matches with stats from the Riot API. Similar to well-known sites that use the same method to obtain data.

Feel free to use it in any ways.

## Requirements
- Node.js
- Riot API Key ([Riot Developer Platform](https://developer.riotgames.com/))

## How to use it

1. Clone repo.
3. Take your Developer API Key from [Riot Developer Platform](https://developer.riotgames.com/).
4. Create/Open an `.env` file. 
5. Fill `RIOT_API_KEY=` with Your API Key. Set your region in `REGION=`:
```
RIOT_API_KEY=RGAPI-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
PORT=3000
REGION=euw1
```
5. Run server + proxy:
```
cd .../lol-match-tracker
npm install
npm start
```
6. Open in the browser:
```
http://localhost:3000
```
## Common problems
- ERR_CONNECTION_REFUSED -> make sure npm start is running and the port (3000) is free.
- 401/403 from Riot → check RIOT_API_KEY.

## Images
![Preview 1](/images/lolmt1.png "View of site")
![Preview 1](/images/lolmt2.png "View of site with Summoner's recent matches")
![Preview 3](/images/lolmt3.png "View of site with Summoner's recent matches")
