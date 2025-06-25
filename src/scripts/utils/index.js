import { getAccessToken, removeAccessToken } from './auth.js';

export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function updateNavigation() {
  const navList = document.getElementById('nav-list');
  const token = getAccessToken();

  if (!navList) return;

  navList.innerHTML = '';

  if (token) {
    navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>
      <li><a href="#/about">About</a></li>
      <li><a href="#" id="logout-link">Logout</a></li>
    `;

    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();

      const confirmLogout = confirm('Apakah benar Anda ingin keluar dari HimyStory?');

      if (confirmLogout) {
        removeAccessToken();
        localStorage.removeItem('name');
        location.hash = '/login';
        updateNavigation();
      }

    });

  } else {
    navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>
    `;
  }
}

export function transitionHelper({ skipTransition = false, updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {});
    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }
  return document.startViewTransition(updateDOM);
}
