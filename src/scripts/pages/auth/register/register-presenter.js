export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered(data) {
    try {
      this.#view.showSubmitLoadingButton();

      const response = await this.#model.getRegistered(data);

      if (response.ok) {
        this.#view.registeredSuccessfully(response.message);
      } else {
        this.#view.registeredFailed(response.message);
      }
    } catch (error) {
      this.#view.registeredFailed('Terjadi kesalahan saat mendaftar.');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }

  handleFormSubmit() {
  const data = this.#view.getFormData();
  this.getRegistered(data);
}

}
