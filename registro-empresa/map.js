let map;
let marker;

// Coordenadas iniciales por defecto (ej. Buenos Aires)
const DEFAULT_COORDS = [-34.6037, -58.3816];
const DEFAULT_ZOOM = 11;

/**
 * Inicialización del mapa Leaflet, centrándolo en las coordenadas acordadas.
 * @param {number} lat - Latitud para centrar el mapa.
 * @param {number} lng - Longitud para centrar el mapa.
 * @param {number} zoom - Nivel de zoom inicial (ej. 15 para calle, 11 para ciudad).
 */
function inicializarMapa(lat, lng, zoom = 15) {
    if (map) {
        // Si el mapa ya existe, solo se reajusta la vista y el marcador
        map.setView([lat, lng], zoom);
    } else {
        // Si no existe, inicializa el mapa
        map = L.map('map').setView([lat, lng], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Configura el evento de click en el mapa
        map.on('click', onMapClick);
    }
    
    // Crear o mover el marcador al punto aproximado encontrado
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], {draggable: true}).addTo(map); 
        marker.on('dragend', function(e) {
            // Actualiza las coordenadas finales al mover el marcador
            onMapClick(e);
        });
    }

    // Guarda las coordenadas aproximadas
    document.getElementById('latitud').value = lat;
    document.getElementById('longitud').value = lng;
    
    // mensaje al usuario
    document.getElementById('coords-display').textContent = 
        `Ubicación aproximada encontrada: ${lat.toFixed(6)}, ${lng.toFixed(6)}. Haz click o arrastra el marcador para ajustar.`;
    
    map.invalidateSize();
}

function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Actualizar o crear marcador
    if (marker) {
        marker.setLatLng(e.latlng);
    } 
    
    // Guardar coordenadas exactas
    document.getElementById('latitud').value = lat;
    document.getElementById('longitud').value = lng;
    
    document.getElementById('coords-display').textContent = 
        `Ubicación FINAL seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}


// URL del servicio de geocodificación (Nominatim de OpenStreetMap)
const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/search'; 

async function intentarGeocodificar() {
    const direccion = document.getElementById('regDireccion').value.trim();
    const mapContainer = document.getElementById('map-container');
    
    if (!direccion) {
        mapContainer.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${GEOCODING_API_URL}?q=${encodeURIComponent(direccion)}&format=json&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            // Si la geocodificación fue un éxito *exacto*, puede saltar el mapa.
            const esMatchExacto = data[0].importance > 0.65; 

            if (esMatchExacto) {
                // Éxito con alta precisión: se guarda y oculta el mapa.
                document.getElementById('latitud').value = lat;
                document.getElementById('longitud').value = lon;
                document.getElementById('coords-display').textContent = `✅ Ubicación GEOCODIFICADA y verificada automáticamente: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
                mapContainer.style.display = 'none';
                return; 
            } else {
                // Éxito con baja precisión / aproximado: se muestra el mapa centrado en el resultado.
                mostrarMapaParaConfirmacion(lat, lon, 17); // Zoom a nivel de calle
                return;
            }
        }
        
        // Si no se encuentra ningún resultado, se muestra el mapa en la ubicación por defecto.
        mostrarMapaParaConfirmacion(DEFAULT_COORDS[0], DEFAULT_COORDS[1], DEFAULT_ZOOM);

    } catch (error) {
        console.error('Error en geocodificación automática:', error);
        // Si hay un error de red o API, se muestra el mapa en la ubicación por defecto como fallback.
        mostrarMapaParaConfirmacion(DEFAULT_COORDS[0], DEFAULT_COORDS[1], DEFAULT_ZOOM);
    }
}

/**
 * Hace visible el mapa y lo centra/inicializa en las coordenadas provistas.
 */
function mostrarMapaParaConfirmacion(lat, lng, zoom) {
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.display = 'block';

    // Se llama a inicializarMapa con las coordenadas aproximadas
    inicializarMapa(lat, lng, zoom); 
}

document.getElementById('regDireccion').addEventListener('change', intentarGeocodificar);