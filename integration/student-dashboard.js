



// const baseUrl = config.baseUrl
// async function getStudentIdFromToken(token) {
//   try {
//     const tokenData = JSON.parse(atob(token.split('.')[1]));
//     return tokenData.studentId; 
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     throw error; // Propagate the error
//   }
// }

// $(document).ready(async function () {

  
//   const storedToken = localStorage.getItem('teachablesstudentaccesstoken');
  
//   if (storedToken) {
//     try {
//       // Get student ID from the token
//       const studentId = await getStudentIdFromToken(storedToken);

//       if (studentId) {
//         // Fetch student data based on the student ID
//         fetchStudentData(studentId, storedToken);
//       } else {
//         console.log('Unable to extract student ID from token.');
//       }
//     } catch (error) {
//       console.error('Error in token processing:', error);
//     }
//   } else {
//     console.log('Token not found in local storage. User may not be authenticated.');
//   }
// });

// function fetchStudentData(studentId, token) {
//   $.ajax({
//     url: `${baseUrl}/api/students/get-student-courses/${studentId}`,
//     type: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//     success: function(data) {
//       // Clear existing content in case this is a subsequent call
//       $('#course-container').empty();

//       // Update HTML content for each course
//       data.courses.forEach(course => {
//         const title = course.title;
//         const courseId = course.course_id;

//         // Create HTML elements for each course and append to the container
//         const courseElement = `
//           <div class="col-xs-12 col-sm-6 col-md-4">
//             <div data-course-id="${courseId}" data-course-url="/courses/enrolled/${courseId}" class="course-listing">
//               <div class="row">
//                 <a href="course-details.html?courseId=${courseId}" data-role="course-box-link">
//                   <div class="col-lg-12">
//                     <div class="course-box-image-container">
//                       <img class="course-box-image" src="./student-dashboard_files/Thumbnail.png" role="presentation" alt="">
//                     </div>
//                     <div class="course-listing-title" id="course-title-${courseId}" role="heading" aria-level="2">
//                       ${title}
//                     </div>
//                     <div class="col-xs-12 course-listing-enrolled" aria-hidden="false">
//                       <p class="course-access-limit hidden">Available until <span></span></p>
//                     </div>
//                   </div>
//                 </a>
//               </div>
//               <div class="course-listing-extra-info" aria-hidden="false">
//                 <div>
//                   <img class="img-circle" src="./student-dashboard_files/JPG-05.jpg" alt="Chroma Tech Academy">
//                   <span class="small course-author-name">Chroma Tech Academy</span>
//                 </div>
//                 <div class="hidden" aria-hidden="true">
                  
//               </div>
//             </div>
//           </div>`;

//         $('#course-container').append(courseElement);
//       });

//       // console.log('Fetched data:', data);
//     },
//     error: function(error) {
//       console.error('Error fetching student data:', error);
//     }
//   });
// }


const baseUrl = config.baseUrl;

$(document).ready(async function () {
  const storedToken = localStorage.getItem('teachablesstudentaccesstoken');
  
  if (storedToken) {
    try {
      // Get student ID from the token
      const studentId = await getStudentIdFromToken(storedToken);

      if (studentId) {
        // Fetch student data based on the student ID
        fetchStudentData(studentId, storedToken);
      } else {
        console.log('Unable to extract student ID from token.');
      }
    } catch (error) {
      console.error('Error in token processing:', error);
    }
  } else {
    console.log('Token not found in local storage. User may not be authenticated.');
  }

  // Attach keyup event handler to search input
  $('#search-courses').keyup(async function(event) {
    const query = $(this).val();
    try {
      // Show loader
      $('#loader-container').removeClass('hidden');
      const response = await searchCourses(query);
      // Hide loader
      $('#loader-container').addClass('hidden');
      // Handle response
      console.log('Search results:', response);
      // Update courses based on search results
      updateCourses(response.courses);
    } catch (error) {
      console.error('Error searching courses:', error);
      // Hide loader in case of error
      $('#loader-container').addClass('hidden');
    }
  });
});

async function getStudentIdFromToken(token) {
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.studentId; 
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error; // Propagate the error
  }
}

async function fetchStudentData(studentId, token) {
  $.ajax({
    url: `${baseUrl}/api/students/get-student-courses/${studentId}`,
    type: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    success: function(data) {
      // Update HTML content for courses
      updateCourses(data.courses);
    },
    error: function(error) {
      console.error('Error fetching student data:', error);
    }
  });
}

async function searchCourses(query) {
  const token = localStorage.getItem('teachablesstudentaccesstoken');
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${baseUrl}/api/students/search-courses/search?query=${query}`,
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      success: function(data) {
        resolve(data);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
}

function updateCourses(courses) {
  // Clear existing content
  $('#course-container').empty();
  // Update HTML content for each course
  courses.forEach(course => {
    const title = course.title;
    const courseId = course.course_id;
    // Create HTML elements for each course and append to the container
    const courseElement = `
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div data-course-id="${courseId}" data-course-url="/courses/enrolled/${courseId}" class="course-listing">
          <div class="row">
            <a href="course-details.html?courseId=${courseId}" data-role="course-box-link">
              <div class="col-lg-12">
                <div class="course-box-image-container">
                  <img class="course-box-image" src="./student-dashboard_files/Thumbnail.png" role="presentation" alt="">
                </div>
                <div class="course-listing-title" id="course-title-${courseId}" role="heading" aria-level="2">
                  ${title}
                </div>
                <div class="col-xs-12 course-listing-enrolled" aria-hidden="false">
                  <p class="course-access-limit hidden">Available until <span></span></p>
                </div>
              </div>
            </a>
          </div>
          <div class="course-listing-extra-info" aria-hidden="false">
            <div>
              <img class="img-circle" src="./student-dashboard_files/JPG-05.jpg" alt="Chroma Tech Academy">
              <span class="small course-author-name">Chroma Tech Academy</span>
            </div>
            <div class="hidden" aria-hidden="true">
          </div>
        </div>
      </div>`;
    $('#course-container').append(courseElement);

    // Logout call
    $('#logout-button').click(async function() {
      console.log("clicked")
      try {
        // Show loader
        $('#loader-container').removeClass('hidden');
        const response = await logout();
        // Hide loader
        $('#loader-container').addClass('hidden');
        // Handle logout success
        console.log('Logout successful:', response.message);
        // Redirect to login page
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Error during logout:', error);
        // Hide loader in case of error
        $('#loader-container').addClass('hidden');
      }
    });
    
  });
}

  // Check authentication when the document is ready
  $(document).ready(function () {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  });
