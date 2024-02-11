window.logout = async function() {
    const baseUrl = config.baseUrl;
    const token = localStorage.getItem('teachablesstudentaccesstoken');
  
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${baseUrl}/api/students/student-logout`,
        type: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        success: function(data) {
          // Clear the JWT token from local storage
          localStorage.removeItem('teachablesstudentaccesstoken');
          resolve(data);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  };
  