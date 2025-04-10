const map = L.map('map').setView([0, 0], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

const issIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);
const pathLine = L.polyline([], { color: '#4e79a7' }).addTo(map);

const apiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';

async function fetchISSData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const { latitude, longitude, velocity, altitude } = data;

    marker.setLatLng([latitude, longitude]);
    pathLine.addLatLng([latitude, longitude]);

    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('lon').textContent = longitude.toFixed(2);
    document.getElementById('vel').textContent = velocity.toFixed(0);
    document.getElementById('alt').textContent = altitude.toFixed(0);
  } catch (error) {
    console.error('Error al obtener datos de la ISS:', error);
  }
}

setInterval(fetchISSData, 5000);
fetchISSData();

// Dark / Light mode toggle
const toggleThemeBtn = document.getElementById('toggle-theme');

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});
