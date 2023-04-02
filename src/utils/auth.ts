import Cookies from 'js-cookie';

const TokenKey = 'vue3-element-admin-token';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
  Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
