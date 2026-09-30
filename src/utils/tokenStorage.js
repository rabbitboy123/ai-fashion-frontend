const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userInfo';

export const tokenStorage = {
  getToken: () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem(USER_KEY));
      return userInfo?.accessToken || localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return localStorage.getItem(TOKEN_KEY) || null;
    }
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getUser: () => {
    try {
      const item = localStorage.getItem(USER_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
