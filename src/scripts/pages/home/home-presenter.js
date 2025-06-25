export default class HomePresenter {
  #view;
  #model;
  #originalStories = [];

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStories(token) {
    this.#view.showLoading();

    const response = await this.#model.getAllStories(token);

    this.#view.hideLoading();

    if (!response.ok) {
      this.#view.showError(response.message || 'Gagal memuat cerita');
      return;
    }

    this.#originalStories = response.listStory;

    this.#view.renderStories(this.#originalStories);
    this.#view.showMap(this.#originalStories);
  }

  searchStories(keyword) {
    const filtered = this.#originalStories.filter((story) =>
      story.name.toLowerCase().includes(keyword.toLowerCase()) ||
      story.description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filtered.length === 0) {
      this.#view.showError('Cerita tidak ditemukan.');
    } else {
      this.#view.renderStories(filtered);
    }
  }

  handleStoryClick(id) {
  this.#view.navigateToDetail(id);
}
}
