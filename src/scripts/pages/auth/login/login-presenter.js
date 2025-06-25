import { saveLoginInfo } from '../../../utils/auth.js';

export default class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async login({ email, password }) {
    this.#view.showSubmitLoadingButton();

    const response = await this.#model.login({ email, password });

    this.#view.hideSubmitLoadingButton();

    if (response.ok) {
      const { userId, name, token } = response.loginResult;
      saveLoginInfo(token, name, userId);
      this.#view.loginSuccess();
    }

    else {
      this.#view.loginFailed(response.message || 'Terjadi kesalahan');
    }
  }
}
