const AuthService = {
  login(token, role) {
    localStorage.setItem('movie_app_token', token);
    localStorage.setItem('movie_app_role', role);
  },
  
  logout() {
    localStorage.removeItem('movie_app_token');
    localStorage.removeItem('movie_app_role');
  },
  
  isAuthenticated() {
    return localStorage.getItem('movie_app_token') !== null;
  },
  
  getUserRole() {
    return localStorage.getItem('movie_app_role');
  },
  
  getAuthHeader() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('movie_app_token')}`,
      'Content-Type': 'application/json'
    };
  }
};

export default AuthService;
