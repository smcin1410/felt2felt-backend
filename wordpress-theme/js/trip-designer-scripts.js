document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('city-select');
    const locationsList = document.getElementById('locations-list');
    const tournamentsList = document.getElementById('tournaments-list');

    const API_URL = 'https://felt2felt-backend.onrender.com';

    let allLocations = [];
    let allTournaments = [];

    /**
     * Fetches all unique city names from both destinations and tournaments
     * and populates the city dropdown menu.
     */
    async function initializeCitySelector() {
        try {
            const [locationsRes, tournamentsRes] = await Promise.all([
                fetch(`${API_URL}/api/destinations`),
                fetch(`${API_URL}/api/tournaments`)
            ]);

            if (!locationsRes.ok || !tournamentsRes.ok) {
                throw new Error('Failed to fetch initial data.');
            }

            allLocations = await locationsRes.json();
            allTournaments = await tournamentsRes.json();

            const locationCities = allLocations.map(loc => loc.city);
            const tournamentCities = allTournaments.map(tourney => tourney.city);

            // Create a unique, sorted list of cities
            const uniqueCities = [...new Set([...locationCities, ...tournamentCities])].sort();

            citySelect.innerHTML = '<option value="">-- Select a City --</option>'; // Clear loading message
            uniqueCities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });

        } catch (error) {
            console.error("Error initializing city selector:", error);
            citySelect.innerHTML = '<option value="">Could not load cities</option>';
        }
    }

    /**
     * Renders the lists of locations and tournaments for the selected city.
     * @param {string} selectedCity The city selected by the user.
     */
    function renderCityData(selectedCity) {
        // Clear previous lists
        locationsList.innerHTML = '';
        tournamentsList.innerHTML = '';

        if (!selectedCity) return;

        // Filter and display locations for the selected city
        const cityLocations = allLocations.filter(loc => loc.city === selectedCity);
        if (cityLocations.length > 0) {
            cityLocations.forEach(location => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" id="loc-${location._id}" name="location" value="${location._id}">
                    <label for="loc-${location._id}">${location.name}</label>
                `;
                locationsList.appendChild(li);
            });
        } else {
            locationsList.innerHTML = '<li>No poker rooms found for this city.</li>';
        }

        // Filter and display tournaments for the selected city
        const cityTournaments = allTournaments.filter(tourney => tourney.city === selectedCity);
        if (cityTournaments.length > 0) {
            cityTournaments.forEach(tournament => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" id="tourney-${tournament._id}" name="tournament" value="${tournament._id}">
                    <label for="tourney-${tournament._id}">${tournament.seriesName}</label>
                `;
                tournamentsList.appendChild(li);
            });
        } else {
            tournamentsList.innerHTML = '<li>No upcoming tournaments found for this city.</li>';
        }
    }

    // Event listener for the city dropdown
    citySelect.addEventListener('change', (e) => {
        renderCityData(e.target.value);
    });

    // Initial load
    initializeCitySelector();
});