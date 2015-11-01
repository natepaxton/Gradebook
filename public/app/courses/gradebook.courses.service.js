angular.module('Gradebook.Courses.Service', [])

.factory('Course', function ($http) {
	var Course = {};

	Course.pushAssignment = function (course_id, assignment_id) {
		return $http.put('/api/courses/' + course_id + '/assignments/' + assignment_id);
	};

	Course.pushStudent = function (course_id, student_id) {
		return $http.put('/api/courses/' + course_id + '/students', {student_id: student_id});
	};

	Course.updateStudent = function (student_id, course_id) {
		return $http.put('/api/students/' + student_id + '/courses/' + course_id);
	}

	Course.getAllStudents = function () {
		return $http.get('/api/students');
	};

	Course.getStudentsIn = function (course_id) {
		return $http.get('/api/courses/' + course_id + '/students');
	};

	Course.getStudentsOut = function (course_id) {
		return $http.get('/api/courses/' + course_id + '/antiStudents');
	};

	return Course;
});