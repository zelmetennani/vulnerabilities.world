import { fetchCountryVulnerabilities } from './sheets-api.js';

// Initialize globe
const globeContainer = document.getElementById('globeContainer');
const globe = Globe()(globeContainer);

// Initialize globe configuration
async function initGlobe() {
    // Configure basic globe appearance
    globe
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .showGraticules(true)
        .showAtmosphere(true)
        .atmosphereColor('#ffffff')
        .atmosphereAltitude(0.15)
        // Add point configuration
        .pointsData([])
        .pointColor('color')
        .pointAltitude(0.01)
        .pointRadius(0.5)
        .onPointClick(handlePointClick);

    // Set up rotation controls
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.05;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;

    // Fetch and set initial data
    await updateVulnerabilityData();

    // Start animation loop
    (function animate() {
        controls.update();
        requestAnimationFrame(animate);
    })();
}

// Function to update the points data
async function updateVulnerabilityData() {
    try {
        const data = await fetchCountryVulnerabilities();
        globe.pointsData(data);
    } catch (error) {
        console.error('Failed to update vulnerability data:', error);
    }
}

// Handle point clicks
function handlePointClick(point) {
    // Stop auto-rotation when clicking a point
    globe.controls().autoRotate = false;
    
    // Animate to the clicked point
    globe.pointOfView({
        lat: point.lat,
        lng: point.lng,
        altitude: 2.5
    }, 1000);
    
    // Update the info panel
    updateInfoPanel(point);
}

// Update info panel with country data
function updateInfoPanel(point) {
    const countryName = document.getElementById('countryName');
    const vulnStats = document.getElementById('vulnStats');
    const additionalStats = document.getElementById('additionalStats');
    
    // Clear previous styles
    countryName.style.color = '#808080';  // grey
    vulnStats.style.color = '#808080';    // grey
    additionalStats.style.color = '#808080'; // grey
    
    // Update content in desired order
    countryName.textContent = point.country;
    vulnStats.textContent = point.topVulnerability;
    additionalStats.textContent = `# of Affected Systems: ${point.affectedSystems.toLocaleString()}`;
}

// Handle window resizing
function handleResize() {
    const { clientWidth, clientHeight } = globeContainer;
    globe
        .width(clientWidth)
        .height(clientHeight);
}

window.addEventListener('resize', handleResize);

// Initialize
initGlobe();
handleResize(); 