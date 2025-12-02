document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const fetchButton = document.getElementById('fetch-button');
    const matchesContainer = document.getElementById('matches-container');

    fetchButton.addEventListener('click', async () => {
        const username = userInput.value;
        if (username) {
            const matches = await fetchMatches(username);
            displayMatches(matches);
        } else {
            alert('Please enter a username.');
        }
    });

    function displayMatches(matches) {
        matchesContainer.innerHTML = '';
        if (matches.length === 0) {
            matchesContainer.innerHTML = '<p>No matches found.</p>';
            return;
        }

        matches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.classList.add('match');
            matchElement.innerHTML = `
                <h3>Match ID: ${match.gameId}</h3>
                <p>Champion: ${match.champion}</p>
                <p>Result: ${match.result}</p>
                <p>Date: ${new Date(match.timestamp).toLocaleDateString()}</p>
            `;
            matchesContainer.appendChild(matchElement);
        });
    }
});