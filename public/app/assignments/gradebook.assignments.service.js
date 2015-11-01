angular.module('Gradebook.Assignments.Service', [])

.factory('Assignment', function ($http, $state) {
	var Assignment = {};

	Assignment.getGrades = function (assignment_id) {
		return $http.get("/api/assignments/" + assignment_id + "/grades");
	};

	Assignment.getStudents = function (course_id) {
		return $http.get('/api/courses/' + course_id + '/students');
	};

	return Assignment;
});