// API para la ubicación actual de la ISS
const url = 'http://api.open-notify.org/iss-now.json';

let map = L.map('map').setView([0, 0], 2);

// Agregar un mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

let issIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

let marker = L.marker([0, 0], { icon: issIcon }).addTo(map);

function fetchISSData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { latitude, longitude } = data.iss_position;

      // Actualizar la posición del marcador en el mapa
      marker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude], 3);

      // Mostrar los datos en pantalla
      document.getElementById('lat').textContent = latitude;
      document.getElementById('lon').textContent = longitude;

      // Para obtener velocidad y altitud, usar una API adicional, si estuviera disponible.
    })
    .catch(error => console.log('Error al obtener datos de la ISS:', error));
}

// Actualizar cada 5 segundos para seguimiento en tiempo real
setInterval(fetchISSData, 5000);

// Llamada inicial para cargar datos
fetchISSData();
