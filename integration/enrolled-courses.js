


  const baseUrl = config.baseUrl;

  async function getStudentIdFromToken(token) {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData.studentId;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw error;
    }
  }

  $(document).ready(async function () {
    const storedToken = localStorage.getItem('teachablesstudentaccesstoken');

    if (storedToken) {
      try {
        const studentId = await getStudentIdFromToken(storedToken);

        if (studentId) {
          getStudentCourses(studentId); // Pass studentId to getStudentCourses function
        } else {
          console.log('Unable to extract student ID from token.');
        }
      } catch (error) {
        console.error('Error in token processing:', error);
      }
    } else {
      console.log('Token not found in local storage. User may not be authenticated.');
    }
  });

  // Function to fetch student courses
  const getStudentCourses = (studentId) => {
    const token = localStorage.getItem('teachablesstudentaccesstoken');
    // Show loader
    $('#loader-container').removeClass('hidden');

    $.ajax({
      url: `${baseUrl}/api/students/get-student-courses/${studentId}`,
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      success: function(data) {
        
        const courses = data.courses;

        // Populate table with courses
        const tableBody = $('#course-table-body');
        tableBody.empty();

        courses.forEach(course => {
          const row = `
            <tr>
              <td>${course.title}</td>
              
              
              <td>${moment(course.created_at).format('DD-MM-YYYY HH:mm')}</td>

              <td>
                <a href="course-details.html?courseId=${course.course_id}" class="edit-course-link" data-course-id="${course.course_id}">
              <button type="button" class="btn btn-primary edit-course-btn">View Details</button>
            </a>

              </td>
            </tr>
          `;
          tableBody.append(row);
        });

        // Hide loader
        $('#loader-container').addClass('hidden');
      },
      error: function(error) {
        console.error('Error fetching student courses:', error.responseJSON.message || error.responseJSON.error);
        if(error.responseJSON.message === "Access token has expired"){
          // console.log("expired")
          window.location.href = "login.html"
        }
        // Hide loader in case of error
        $('#loader-container').addClass('hidden');
      }
    });
  };

  // Example event listener for edit button click
  $(document).on('click', '.edit-course-btn', function() {
    const courseId = $(this).data('course-id');
    // Perform actions for editing the course
    // console.log('Editing course:', courseId);
  });

    // Check authentication when the document is ready
    $(document).ready(function () {
      if (!isAuthenticated()) {
        redirectToLogin();
      }
    });
