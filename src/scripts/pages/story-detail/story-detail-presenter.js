import { MAP_SERVICE_API_KEY } from '../../config.js';

export default class StoryDetailPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStoryById(id, token) {
    try {
      const response = await this.#model.getStoryById(token, id);

      if (!response || !response.story) {
        this.#view.showError('Cerita tidak ditemukan');
        return;
      }

      const story = response.story;

      const locationName = await this.#getLocationName(story.lat, story.lon);

      this.#view.showStoryDetail(story, locationName);

      this.#view.showMapMarker({
        lat: story.lat,
        lon: story.lon,
        name: story.name,
      });

    } catch (error) {
      console.error(error);
      this.#view.showError('Terjadi kesalahan saat memuat detail cerita.');
    }
  }

  async #getLocationName(lat, lon) {
    try {
      const url = new URL(`https://api.maptiler.com/geocoding/${lon},${lat}.json`);
      url.searchParams.set('key', MAP_SERVICE_API_KEY);
      url.searchParams.set('language', 'id');
      url.searchParams.set('limit', '1');

      const response = await fetch(url);
      const data = await response.json();

      return data?.features?.[0]?.place_name || `${lat}, ${lon}`;
    } catch (error) {
      console.error('Gagal memuat lokasi dari MapTiler:', error);
      return `${lat}, ${lon}`;
    }
  }
}
