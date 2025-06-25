import { getAboutInfo } from '../../data/api.js';

export default class AboutPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  showAboutInfo() {
    const aboutData = getAboutInfo();
    this.#view.renderAboutData(aboutData); 
  }
}
