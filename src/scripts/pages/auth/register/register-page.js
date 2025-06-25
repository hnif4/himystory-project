import RegisterPresenter from './register-presenter';
import * as API from '../../../data/api';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container">
        <div class="register-form-container">
          <h1 class="register__title">Daftar Akun</h1>

          <form id="register-form" class="register-form">
            <div class="form-control">
              <label for="name-input">Nama Lengkap</label>
              <input id="name-input" type="text" name="name" placeholder="Masukkan nama lengkap Anda" required>
            </div>

            <div class="form-control">
              <label for="email-input">Email</label>
              <input id="email-input" type="email" name="email" placeholder="Contoh: hanifah@email.com" required>
            </div>

            <div class="form-control">
              <label for="password-input">Password (min. 8 karakter)</label>
              <input id="password-input" type="password" name="password" minlength="8" required placeholder="********">
            </div>

            <div id="submit-button-container">
              <button class="btn" type="submit">Daftar Akun</button>
            </div>

            <p class="form-note">Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: API,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#presenter.handleFormSubmit();
    });
  }


  registeredSuccessfully(message) {
    alert(`Berhasil daftar: ${message}`);
    location.hash = '/login';
  }

  registeredFailed(message) {
    alert(`Gagal daftar: ${message}`);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <span class="loader-button"></span> Mendaftar...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Daftar Akun</button>
    `;
  }

  getFormData() {
  return {
    name: document.getElementById('name-input').value.trim(),
    email: document.getElementById('email-input').value.trim(),
    password: document.getElementById('password-input').value,
  };
}

}
