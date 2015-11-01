angular.module('Gradebook.Grades.Ctrl', [
	'Gradebook.Grades.Service'
])

.controller('Grade.Ctrl', ['$scope', '$http', '$state', 'Grade', function ($scope, $http, $state, Grade) {
	$scope.viewType = "Grades";

	$scope.students = [];
	$scope.grades = [];
	$scope.comments = [];

	$http.get('/api/assignments/' + $state.params.assignment_id).success(function (data) {
		$scope.assignment = data;

		$http.get('/api/courses/' + $scope.assignment.course._id + '/students').success(function (data) {
			for(var i=0; i<data.length; i++) {
				$scope.students.push(data[i]);
			}
		})
		.error(function (err) {
			console.log(err);
		});
	})
	.error(function (err) {
		console.log(err);
	});

	$scope.enterGrades = function () {
		for(var i=0; i<$scope.students.length; i++) {
			$http.post('/api/' + $scope.students[i]._id + '/' + $state.params.assignment_id + "/grade", {score: $scope.grades[i], comment: $scope.comments[i]}).success(function (data) {
				console.log("Grade entered");
				$state.go('gradeDetail', {assignment_id: $state.params.assignment_id});	
			})
			.error(function (err) {
				console.log(err);
			});
		};
	}
}])

.controller('Grade.Detail.Ctrl', ['$scope', '$http', '$state', '$stateParams', 'Grade', function ($scope, $http, $state, $stateParams, Grade) {
	//Scope properties
	$scope.viewName = "Assignment Grades";
	$scope.assignment = "";
	$scope.students = [];
	var course_id = "";

	//Service methods
	Grade.getAssignment($stateParams.assignment_id).success (function (data) {
		$scope.assignment = data;
		Grade.getStudents($scope.assignment.course._id).success (function (data) {
			$scope.students = data;
		});
	});

	Grade.getAssignmentGrades($stateParams.assignment_id).success (function (data) {
		$scope.grades = data;
	});
	
}]);