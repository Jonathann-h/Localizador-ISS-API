// API para la ubicación actual de la ISS
const url = 'http://api.open-notify.org/iss-now.json';

let map = L.map('map').setView([0, 0], 2); // Inicializa el mapa centrado en coordenadas (0, 0)

// Agregar un mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Icono de la ISS
let issIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50], // Tamaño del icono
  iconAnchor: [25, 25], // Punto de anclaje del icono
});

let marker = L.marker([0, 0], { icon: issIcon }).addTo(map); // Añadir marcador al mapa

function fetchISSData() {
  fetch(url) // Realiza la llamada a la API
    .then(response => response.json())
    .then(data => {
      const { latitude, longitude } = data.iss_position; // Extrae latitud y longitud

      // Actualizar la posición del marcador en el mapa
      marker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude], 3); // Cambia la vista del mapa a la posición actual

      // Mostrar los datos en pantalla
      document.getElementById('lat').textContent = latitude;
      document.getElementById('lon').textContent = longitude;
    })
    .catch(error => console.log('Error al obtener datos de la ISS:', error)); // Manejo de errores
}

// Actualizar cada 5 segundos para seguimiento en tiempo real
setInterval(fetchISSData, 5000);

// Llamada inicial para cargar datos
fetchISSData();
