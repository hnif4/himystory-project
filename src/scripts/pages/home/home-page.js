import { showFormattedDate } from '../../utils';
import HomePresenter from './home-presenter';
import * as API from '../../data/api';
import { getAccessToken } from '../../utils/auth';
import StoryMap from '../../utils/map.js';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="hero-text">
        <h1>Belajar Bersama Teman dari Berbagai Daerah</h1>
        <p>Dengarkan kisah inspiratif mereka dan temukan semangat baru dalam belajar.</p>
      </section>

      <section class="story-search">
        <input type="text" id="search-input" placeholder="Cari cerita berdasarkan nama atau isi..." aria-label="Cari Cerita">
      </section>

      <section class="map-section">
        <h2>🗺️ Peta Asal Pembelajar Dicoding</h2>
        <div id="story-map" style="height: 400px;"></div>
      </section>

      <section class="container" aria-labelledby="stories-heading">
        <h2>🚀 Cerita Inspiratif </h2>
        <div id="story-list" class="story-list"></div>
      </section>

      <section id="loading" style="display: none; text-align: center; margin: 1rem;">
        <p>Loading...</p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: API,
    });

    this.#presenter.loadStories(getAccessToken());

    document.getElementById('search-input')
      .addEventListener('input', (e) => {
        this.#presenter.searchStories(e.target.value.trim());
      });
  }

  renderStories(stories) {
    const storyList = document.getElementById('story-list');

    storyList.innerHTML = stories.map((story) => `
      <div class="story-card" data-id="${story.id}" style="cursor: pointer;">
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}">
        <div class="story-info">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <small>${showFormattedDate(story.createdAt, 'id-ID')}</small>
          <button class="btn-detail" data-id="${story.id}">Baca Selengkapnya</button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.story-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.#presenter.handleStoryClick(id);
      });
    });

    document.querySelectorAll('.btn-detail').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = button.dataset.id;
        this.#presenter.handleStoryClick(id); 
      });
    });
  }

  showError(message) {
    const listElement = document.getElementById('story-list');
    listElement.innerHTML = `<p style="color: red;">${message}</p>`;
  }

  showLoading() {
    document.getElementById('loading').style.display = 'block';
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  async showMap(stories) {
  const storyMap = new StoryMap('story-map');
  await storyMap.addMarkersFromStories(stories);
}

  navigateToDetail(id) {
  window.location.hash = `#/story/${id}`;
}

}
