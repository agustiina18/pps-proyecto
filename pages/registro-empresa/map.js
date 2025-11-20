let map;
let marker;

// Coordenadas iniciales por defecto (ej. Buenos Aires, Argentina)
const DEFAULT_COORDS = [-34.6037, -58.3816];
const DEFAULT_ZOOM = 12; // Zoom a nivel de ciudad

// URL del servicio de geocodificación (Nominatim de OpenStreetMap)
const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/search'; 

/**
 * Inicializa el mapa Leaflet, centrándolo en las coordenadas provistas.
 * Esta función es llamada una vez al inicio y luego para reajustar la vista.
 * @param {number} lat - Latitud para centrar el mapa.
 * @param {number} lng - Longitud para centrar el mapa.
 * @param {number} zoom - Nivel de zoom.
 */
function inicializarMapa(lat, lng, zoom) {
    if (map) {
        // Si el mapa ya existe, solo reajusta la vista
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
    
    // Crear o mover el marcador al punto
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], {draggable: true}).addTo(map); 
        marker.on('dragend', function(e) {
            // Actualiza las coordenadas finales al mover el marcador
            onMapClick(e);
        });
    }

    // Guarda las coordenadas iniciales/aproximadas
    actualizarCoordenadas(lat, lng);
    
    // Si el mapa ya se inicializó, asegurar que se recalcule su tamaño si su contenedor cambió de display:none
    if (document.getElementById('map-container').style.display !== 'none') {
        map.invalidateSize();
    }
}

/**
 * Actualiza los inputs ocultos y el display visible de las coordenadas.
 * @param {number} lat - Latitud.
 * @param {number} lng - Longitud.
 */
function actualizarCoordenadas(lat, lng) {
    document.getElementById('latitud').value = lat.toFixed(6);
    document.getElementById('longitud').value = lng.toFixed(6);
    document.getElementById('lat-display').textContent = lat.toFixed(6);
    document.getElementById('lng-display').textContent = lng.toFixed(6);
}

/**
 * Manejador de click en el mapa y dragend del marcador.
 * @param {object} e - Evento de Leaflet.
 */
function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Mover el marcador (si es evento de click, si es dragend ya se movió)
    if (marker && e.type === 'click') {
        marker.setLatLng(e.latlng);
    } 
    
    // Guardar coordenadas finales
    actualizarCoordenadas(lat, lng);
}


/**
 * Intenta geocodificar la dirección ingresada y centra el mapa.
 */
async function intentarGeocodificar() {
    const direccion = document.getElementById('direccion').value.trim();
    
    if (!direccion) {
        // Si no hay dirección, centrar en ubicación por defecto
        inicializarMapa(DEFAULT_COORDS[0], DEFAULT_COORDS[1], DEFAULT_ZOOM);
        return;
    }

    try {
        const response = await fetch(`${GEOCODING_API_URL}?q=${encodeURIComponent(direccion)}&format=json&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            const zoom = 17; // Zoom de calle
            
            inicializarMapa(lat, lon, zoom);
            
        } else {
            // Si no se encuentra un resultado, mostrar mensaje y centrar en default
            mostrarModal("Dirección no encontrada", "No pudimos localizar la dirección automáticamente. Por favor, usa el marcador para seleccionar el punto exacto.", 'error');
            inicializarMapa(DEFAULT_COORDS[0], DEFAULT_COORDS[1], DEFAULT_ZOOM);
        }
    } catch (error) {
        console.error('Error en geocodificación automática:', error);
        mostrarModal("Error de Conexión", "Hubo un problema al intentar geocodificar la dirección. Por favor, verifica tu conexión o ajusta la ubicación manualmente.", 'error');
        inicializarMapa(DEFAULT_COORDS[0], DEFAULT_COORDS[1], DEFAULT_ZOOM);
    }
}

// === INICIALIZACIÓN AUTOMÁTICA AL CARGAR LA PÁGINA ===
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializa el mapa con la ubicación por defecto
    inicializarMapa(DEFAULT_COORDS[0], DEFAULT_COORDS[1], DEFAULT_ZOOM);

    // 2. Adjunta el manejador de geocodificación al input de dirección
    document.getElementById('direccion').addEventListener('change', intentarGeocodificar);
});