import AboutPresenter from './about-presenter.js';

export default class AboutPage {
  #presenter;

  async render() {
    return `
      <section class="about container" aria-label="Tentang Aplikasi">
        <div id="about-content"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AboutPresenter({ view: this });
    this.#presenter.showAboutInfo();
  }

  renderAboutData(data) {
  const container = document.getElementById('about-content');
  container.innerHTML = `
   <article>
        <h1>Tentang Aplikasi</h1>
        <p><strong>${data.name}</strong></p>
        <p>${data.description}</p>

        <section>
          <h2>Fitur yang Tersedia</h2>
          <ul>
            ${data.features.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </section>

        <section>
          <h2>Fitur Mendatang</h2>
          <ul>
            ${data.futureFeatures.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </section>

        <p><em>${data.author}</em></p>
      </article>
    `;
  }
}