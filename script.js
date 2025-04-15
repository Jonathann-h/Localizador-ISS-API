// ISS Tracker
let firstLoad = true; //Bandera para verificar si es la primera carga
let lastLatLng = [0, 0]; // Última posición 

const map = L.map('map').setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const issIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);
const pathLine = L.polyline([], { color: '#4e79a7' }).addTo(map);

// Theme Toggle
const themeToggle = {
  btn: document.getElementById('toggle-theme'),
  icon: document.querySelector('.theme-icon'),
  
  init() {
    this.loadPreference();
    this.btn.addEventListener('click', () => this.toggle());
  },
  
  toggle() {
    document.body.classList.toggle('light-mode');
    this.update();
    this.savePreference();
  },
  
  update() {
    const isLight = document.body.classList.contains('light-mode');
    this.icon.innerHTML = isLight ? '&#127769;' : '&#9728;&#65039;';
    this.btn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  },
  
  savePreference() {
    localStorage.setItem('themePreference', 
      document.body.classList.contains('light-mode') ? 'light' : 'dark');
  },
  
  loadPreference() {
    if (localStorage.getItem('themePreference') === 'light') {
      document.body.classList.add('light-mode');
    }
    this.update();
  }
};

// ISS Data Fetch
const fetchISSData = async () => {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const { latitude, longitude, velocity, altitude } = await response.json();
    
    marker.setLatLng([latitude, longitude]);
    pathLine.addLatLng([latitude, longitude]);
    lastLatLng = [latitude, longitude]; // Actualiza la última posición

    if(firstLoad) { // Si es la primera carga, centra el mapa en la posición inicial
      map.setView([latitude, longitude], 3);
      firstLoad = false;
    }
    //marker.bindTooltip(`Lat: ${latitude.toFixed(2)}<br>Lon: ${longitude.toFixed(2)}`).openTooltip(); // Tooltip con la posición actual
        
    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('lon').textContent = longitude.toFixed(2);
    document.getElementById('vel').textContent = Math.round(velocity);
    document.getElementById('alt').textContent = Math.round(altitude);
  } catch (error) {
    console.error('Error fetching ISS data:', error);
  }
};

document.getElementById('recenter-btn').addEventListener('click', () => {
  map.setView(lastLatLng, 4);
});

// Initialize
themeToggle.init();
fetchISSData();
setInterval(fetchISSData, 5000);