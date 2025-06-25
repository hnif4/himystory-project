const TOKEN_KEY = 'access_token';
const USER_NAME_KEY = 'name';
const USER_ID_KEY = 'userId';

export function saveAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUserInfo(name, userId) {
  localStorage.setItem(USER_NAME_KEY, name);
  localStorage.setItem(USER_ID_KEY, userId);
}

export function getUserInfo() {
  return {
    name: localStorage.getItem(USER_NAME_KEY),
    userId: localStorage.getItem(USER_ID_KEY),
  };
}

export function removeUserInfo() {
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function getLogout() {
  removeAccessToken();
  removeUserInfo();
}

export function saveLoginInfo(token, name, userId) {
  saveAccessToken(token);
  saveUserInfo(name, userId);
}
