import '../styles/styles.css';

import App from './pages/app';
import { updateNavigation } from './utils';
import 'leaflet/dist/leaflet.css';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();
  updateNavigation();

  const skipLink = document.getElementById('skip-link');
  const mainContent = document.getElementById('main-content');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    });
  }

  window.addEventListener('hashchange', async () => {
    const mainContent = document.getElementById('main-content');

    mainContent.classList.add('fade-exit');
    mainContent.classList.add('fade-exit-active');

    setTimeout(async () => {
      await app.renderPage();
      updateNavigation();

      mainContent.classList.remove('fade-exit', 'fade-exit-active');
      mainContent.classList.add('fade-enter');
      requestAnimationFrame(() => {
        mainContent.classList.add('fade-enter-active');

        setTimeout(() => {
          mainContent.classList.remove('fade-enter', 'fade-enter-active');
        }, 300);
      });
    }, 300);
  });

});

