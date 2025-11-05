import api from '../api/axios';

export const login = (email, password) => {
  return api.post('/login', { email, password });
};

export const register = (data) => {
  return api.post('/register', data);
};

export const logout = (token) => {
  return api.post('/logout', null, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
