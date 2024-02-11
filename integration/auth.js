
function isAuthenticated() {
    return localStorage.getItem('teachablesstudentaccesstoken') !== null;
  }
  
  function redirectToLogin() {
    window.location.href = 'login.html';
  }
  

  