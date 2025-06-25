import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_SERVICE_API_KEY } from '../config.js';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

export default class StoryMap {
  #map = null;

  constructor(containerId, options = {}) {
    const defaultOptions = {
      center: [-2.5489, 118.0148], 
      zoom: 5,
      scrollWheelZoom: false,
    };

    const container = document.getElementById(containerId);
    if (container && container._leaflet_id) {
      container._leaflet_id = null; 
    }

    this.#map = L.map(containerId, { ...defaultOptions, ...options });

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    });

    const mapTilerStreets = L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAP_SERVICE_API_KEY}`, {
      attribution: '&copy; <a href="https://www.maptiler.com">MapTiler</a>',
      tileSize: 512,
      zoomOffset: -1,
    });

    const mapTilerSatellite = L.tileLayer(`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAP_SERVICE_API_KEY}`, {
      attribution: '&copy; <a href="https://www.maptiler.com">MapTiler</a>',
      tileSize: 512,
      zoomOffset: -1,
    });

    osmLayer.addTo(this.#map); // Layer default

    L.control.layers(
      {
        'OpenStreetMap': osmLayer,
        'MapTiler Streets': mapTilerStreets,
        'MapTiler Satellite': mapTilerSatellite,
      }
    ).addTo(this.#map);
  }

  getCenter() {
    const { lat, lng } = this.#map.getCenter();
    return { lat, lng };
  }

  addMarker(coordinates, options = {}) {
    const marker = L.marker(coordinates, options);
    marker.addTo(this.#map);
    return marker;
  }

  async addPopupMarker({ lat, lon, name }) {
    if (!lat || !lon) return;

    let locationName = '';
    try {
      const url = new URL(`https://api.maptiler.com/geocoding/${lon},${lat}.json`);
      url.searchParams.set('key', MAP_SERVICE_API_KEY);
      url.searchParams.set('language', 'id');
      url.searchParams.set('limit', '1');

      const response = await fetch(url);
      const data = await response.json();
      locationName = data?.features?.[0]?.place_name || '';
    } catch (error) {
      console.error('Gagal mengambil nama lokasi:', error);
    }

    const popupContent = `
      <strong>${name || 'Tanpa Nama'}</strong><br>
      <em>${locationName}</em><br>
    `;

    const marker = L.marker([lat, lon]).addTo(this.#map);
    marker.bindPopup(popupContent);

  }

  async addMarkersFromStories(stories) {
    for (const story of stories) {
      await this.addPopupMarker(story);
    }
  }

  onClick(callback) {
    this.#map.on('click', callback);
  }

  addMapEventListener(eventName, callback) {
    this.#map.on(eventName, callback);
  }
}
