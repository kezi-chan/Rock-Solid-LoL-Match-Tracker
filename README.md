# Rock-Solid-LoL-Match-Tracker
A project to test out the Riot API and create a LoL Match Tracker. It served me as a learning resource,

Feel free to use it in any ways.

## How to use it

1. Import all files.
2. Take your Developer API Key from [Riot Developer Platform](https://developer.riotgames.com/).
3. Open `.env` file. 
4. Fill `RIOT_API_KEY=` with Your API Key. Set your region in `REGION=`.
###### `.env` Should look like that:

```
RIOT_API_KEY=RGAPI-7cf85766-d492-401c-82a0-7155713f692f
PORT=3000
REGION=eun1
```
5. Open your console and run the localhost server. I was using:
```
cd .../lol-match-tracker
npm install
npm start
```
6. Enter `localhost:3000` on your browser and enjoy.
