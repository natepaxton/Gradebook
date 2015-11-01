angular.module('Gradebook.Grades.Service', [])

.factory('Grade', function ($http) {
	var Grade = {};

	Grade.getAssignment = function(assignment_id) {
		return $http.get('/api/assignments/' + assignment_id);
	}

	Grade.getStudents = function(course_id) {
		return $http.get('/api/courses/' + course_id + '/students');
	}

	Grade.getAssignmentGrades = function(assignment_id) {
		return $http.get('/api/assignments/' + assignment_id + '/grades');
	}

	return Grade;
});