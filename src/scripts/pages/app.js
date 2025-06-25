import routes from '../routes/routes';
import { getActivePathname, getActiveRoute } from '../routes/url-parser';
import { updateNavigation } from '../utils';
import { getAccessToken } from '../utils/auth.js';


class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  async renderPage() {
    const pathname = getActivePathname();
    const routeName = getActiveRoute();
    const pageFactory = routes[routeName];

    const protectedRoutes = ['/', '/about'];
    const isProtectedRoute =
      protectedRoutes.includes(pathname) || pathname.startsWith('/story/');

    const token = getAccessToken();

    if (!pageFactory) {
      this.#content.innerHTML = `
    <section class="not-found container">
      <h1>404 - Halaman tidak ditemukan</h1>
      <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
      <a href="#/">⬅️ Kembali ke Beranda</a>
    </section>
  `;
      return;
    }


    if (isProtectedRoute && !token) {
      location.hash = '/login';
      return;
    }

    if (this.#currentPage && typeof this.#currentPage.destroy === 'function') {
      this.#currentPage.destroy();
    }

    const page = typeof pageFactory === 'function' ? pageFactory() : pageFactory;
    this.#currentPage = page;

    this.#content.innerHTML = await page.render();
    await page.afterRender();

    updateNavigation();
  }

}

export default App;
