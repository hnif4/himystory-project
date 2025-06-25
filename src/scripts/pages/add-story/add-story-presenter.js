import { addStory, addStoryAsGuest } from '../../data/api.js';
import { getAccessToken } from '../../utils/auth';

export default class AddStoryPresenter {
  #view;
  #camera = null;
  #photo = null;
  #lat = null;
  #lon = null;

  constructor(view) {
    this.#view = view;
  }

  setCamera(cameraInstance) {
    this.#camera = cameraInstance;
  }

  async onTakePhoto() {
    if (!this.#camera) {
      this.#view.showError('Kamera tidak tersedia.');
      return;
    }

    const photo = await this.#camera.takePicture();

    if (photo) {
      this.#photo = photo;
      this.#view.updatePhotoList(photo.name);
    } else {
      this.#view.showError('Gagal mengambil gambar.');
    }
  }

  onFileSelected(file) {
    if (!file || !file.type.startsWith('image/')) {
      this.#view.showError('Hanya file gambar yang diperbolehkan.');
      return;
    }

    if (file.size > 1024 * 1024) {
      this.#view.showError('Ukuran file maksimal 1MB.');
      return;
    }

    this.#photo = file;
    this.#view.updatePhotoList(file.name);
  }

  onLocationSelected(lat, lon) {
    this.#lat = lat;
    this.#lon = lon;
    this.#view.updateLatLng(lat, lon);
  }

  async onSubmit({ description, token }) {
    if (!description || !this.#photo || this.#lat == null || this.#lon == null) {
      this.#view.showError('Semua kolom wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);

    try {
      
      if (typeof this.#photo === 'object' && this.#photo.dataUrl) {
        const blob = await (await fetch(this.#photo.dataUrl)).blob();
        formData.append('photo', blob, this.#photo.name || 'photo.jpg');
      } else {
        
        formData.append('photo', this.#photo);
      }

      formData.append('lat', this.#lat);
      formData.append('lon', this.#lon);

      const response = token
        ? await addStory(token, formData)
        : await addStoryAsGuest(formData);

      if (!response.error) {
        this.#view.showSuccess(response.message);
        this.#view.redirectToHome();
      } else {
        this.#view.showError(response.message);
      }
    } catch (error) {
      console.error(error);
      this.#view.showError('Terjadi kesalahan saat mengirim data. Coba lagi nanti.');
    }
  }

  async onToggleCamera({ cameraContainer, openCameraButton }) {
  if (!this.#camera) {
    this.#view.showError('Kamera tidak tersedia.');
    return;
  }

  const isOpen = cameraContainer.style.display !== 'none';

  if (isOpen) {
    cameraContainer.style.display = 'none';
    openCameraButton.textContent = 'Buka Kamera';
    this.#camera.stop();
  } else {
    cameraContainer.style.display = 'flex';
    openCameraButton.textContent = 'Tutup Kamera';
    await this.#camera.launch();
  }
}

async onFormSubmit({ description }) {
  const token = getAccessToken();
  await this.onSubmit({ description, token });
}


initializeMap(mapInstance) {
  const centerCoordinate = mapInstance.getCenter();
  
  this.#lat = centerCoordinate.lat;
  this.#lon = centerCoordinate.lng;
  this.#view.updateLatLng(this.#lat, this.#lon);

  const draggableMarker = mapInstance.addMarker([this.#lat, this.#lon], {
    draggable: true,
  });

  

  draggableMarker.on('move', (event) => {
    const { lat, lng } = event.target.getLatLng();
    this.#lat = lat;
    this.#lon = lng;
    this.#view.updateLatLng(lat, lng);
  });

  mapInstance.onClick((e) => {
    const { lat, lng } = e.latlng;
    draggableMarker.setLatLng([lat, lng]);
    this.#lat = lat;
    this.#lon = lng;
    this.#view.updateLatLng(lat, lng);
    e.sourceTarget.flyTo(e.latlng);
  });
}


}
