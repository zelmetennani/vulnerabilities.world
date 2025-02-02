// Use the published CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRI9t_WDl9jqSgV_8UCcIfyfwDNV2sH6Hh4MI1yTsiVhdUGnUbtkvAAK-KsMczWE_v-omO1dE_Xm0lk/pub?output=csv';

// Add coordinates for each country
const countryCoordinates = {
    'United States': { lat: 40.7128, lng: -74.0060 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'Russia': { lat: 55.7558, lng: 37.6173 },
    'United Kingdom': { lat: 51.5074, lng: -0.1278 },
    'Germany': { lat: 52.5200, lng: 13.4050 },
    'Japan': { lat: 35.6762, lng: 139.6503 },
    'Brazil': { lat: -15.7975, lng: -47.8919 },
    'India': { lat: 28.6139, lng: 77.2090 },
    'France': { lat: 48.8566, lng: 2.3522 },
    'Canada': { lat: 45.4215, lng: -75.6972 },
    'Australia': { lat: -35.2809, lng: 149.1300 },
    'South Korea': { lat: 37.5665, lng: 126.9780 },
    'Netherlands': { lat: 52.3676, lng: 4.9041 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Israel': { lat: 31.7683, lng: 35.2137 }
};

async function fetchCountryVulnerabilities() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        
        // Skip the header row and parse CSV
        const rows = text.split('\n').slice(1);
        
        // Log the raw data to see what we're getting
        console.log('Raw CSV rows:', rows);
        
        return rows.map(row => {
            const values = row.split(',');
            const country = values[0];
            const vulnerability = values[1];
            // Convert the affected systems value to a number and remove any whitespace
            const affectedSystems = Number(values[2].replace(/[^\d]/g, ''));
            
            // Log each parsed row
            console.log('Parsing row:', {
                country,
                vulnerability,
                affectedSystems
            });
            
            const coords = countryCoordinates[country.trim()] || { lat: 0, lng: 0 };
            
            return {
                country: country.trim(),
                topVulnerability: vulnerability.trim(),
                affectedSystems: affectedSystems,
                lat: coords.lat,
                lng: coords.lng,
                color: getColorByAffectedCount(affectedSystems)
            };
        });
    } catch (error) {
        console.error('Error fetching vulnerability data:', error);
        return [];
    }
}

// Helper function to get color based on affected systems count
function getColorByAffectedCount(count) {
    if (count > 10000) return '#ff0000';      // High risk - red
    if (count > 5000) return '#ff4444';       // Medium-high risk - lighter red
    if (count > 1000) return '#ff8888';       // Medium risk - pink
    return '#ffcccc';                         // Low risk - very light red
}

export { fetchCountryVulnerabilities }; 