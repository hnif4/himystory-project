import LoginPresenter from './login-presenter';
import * as API from '../../../data/api';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container">
        <div class="register-form-container">
          <h1 class="register__title">Masuk ke Akun</h1>

          <form id="login-form" class="register-form">
            <div class="form-control">
              <label for="email-input">Email</label>
              <input id="email-input" type="email" name="email" placeholder="Masukkan email Anda" required>
            </div>

            <div class="form-control">
              <label for="password-input">Password</label>
              <input id="password-input" type="password" name="password" placeholder="********" required>
            </div>

            <div id="submit-button-container">
              <button class="btn" type="submit">Masuk</button>
            </div>

            <p class="form-note">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: API,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email-input').value.trim(),
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.login(data);
    });
  }

  loginSuccess() {
    alert('Login berhasil!');
    location.hash = '/';
  }

  loginFailed(message) {
    alert(`Login gagal: ${message}`);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <span class="loader-button"></span> Masuk...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Masuk</button>
    `;
  }
}
