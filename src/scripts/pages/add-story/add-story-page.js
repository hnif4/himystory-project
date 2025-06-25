import Camera from '../../utils/camera';
import StoryMap from '../../utils/map';
import AddStoryPresenter from './add-story-presenter';

export default class AddStoryPage {
  #camera;
  #map;
  #presenter;

  constructor() {
    this.#presenter = new AddStoryPresenter(this);
  }

  async render() {
    return `
      <section class="new-form">
        <div class="container">
          <h1>Bagikan Cerita Anda</h1>
          <form id="add-story-form" class="form" enctype="multipart/form-data" role="form">
            <!-- Deskripsi -->
            <div class="form-control">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" rows="4" required></textarea>
            </div>
            <!-- Dokumentasi -->
            <div class="form-control">
              <label for="photo-file">Dokumentasi</label>
              <div class="new-form__documentations__buttons">
                <button type="button" id="open-camera-button" class="btn btn-outline">Buka Kamera</button>
                <button type="button" id="take-photo-button" class="btn btn-outline">Ambil Gambar</button>
              </div>
              <div id="camera-container" class="new-form__camera__container">
                <video id="camera-video" aria-label="Tampilan Kamera"></video>
                <canvas id="camera-canvas"></canvas>
                <select id="camera-select" aria-label="Pilih Kamera"></select>
              </div>
              <p style="margin-top: 1rem">Atau unggah gambar dari perangkat:</p>
              <input type="file" id="photo-file" accept="image/*" multiple>
              <ul id="documentations-taken-list"></ul>
            </div>

            <!-- Lokasi -->
            <div class="form-control">
              <label for="map">Lokasi</label>
              <div id="map" class="new-form__location__map"></div>
              <div class="new-form__location__lat-lng">
                <label for="latitude" hidden>Latitude</label>
                <input type="number" id="latitude" name="latitude" disabled>
                <label for="longitude" hidden>Longitude</label>
                <input type="number" id="longitude" name="longitude" disabled>
              </div>
            </div>

            <!-- Tombol -->
            <div class="form-buttons">
              <button type="submit" class="btn">Kirim</button>
              <button type="button" class="btn btn-outline" onclick="window.location.hash = '#/'">Batal</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Setup Kamera
    this.#camera = new Camera({
      video: document.getElementById('camera-video'),
      cameraSelect: document.getElementById('camera-select'),
      canvas: document.getElementById('camera-canvas'),
    });

    this.#presenter.setCamera(this.#camera);

    const openCameraButton = document.getElementById('open-camera-button');
    const takePhotoButton = document.getElementById('take-photo-button');
    const fileInput = document.getElementById('photo-file');
    const cameraContainer = document.getElementById('camera-container');
    const form = document.getElementById('add-story-form');

    cameraContainer.style.display = 'none';

    openCameraButton.addEventListener('click', () => {
      this.#presenter.onToggleCamera({ cameraContainer, openCameraButton });
    });


    takePhotoButton.addEventListener('click', () => {
      this.#presenter.onTakePhoto();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      this.#presenter.onFileSelected(file);
    });


    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const description = document.getElementById('description')?.value.trim();
      this.#presenter.onFormSubmit({ description });
    });


    this._latitudeInput = document.getElementById('latitude');
    this._longitudeInput = document.getElementById('longitude');

    this.#map = new StoryMap('map', { zoom: 5, locate: true });
    this.#presenter.initializeMap(this.#map);

  }

  updatePhotoList(name) {
    const list = document.getElementById('documentations-taken-list');
    list.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = name;
    list.appendChild(li);
  }


  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    alert(message);
  }

  redirectToHome() {
    window.location.hash = '#/';
  }

  destroy() {
    if (this.#camera && typeof this.#camera.stop === 'function') {
      this.#camera.stop();
    }
  }


  updateLatLng(lat, lng) {
    this._latitudeInput.value = lat.toFixed(6);
    this._longitudeInput.value = lng.toFixed(6);
  }

}