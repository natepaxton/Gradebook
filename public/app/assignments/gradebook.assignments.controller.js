
angular.module('Gradebook.Assignments.Ctrl', [
	'Gradebook.Courses.Service',
	'Gradebook.Assignments.Service'
])

.controller('Assignment.Ctrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Assignments";
	$http.get("/api/assignments").success (function (data) {
		$scope.assignmentData = data;
		console.log("Assignments retrieved");
	})
	.error (function () {
		console.log("Assignments not retrieved");
	});

	$scope.remove = function (assignmentId) {
		$http.delete("/api/assignments/" + assignmentId);
		$state.go($state.current, {}, {reload: true});
	};
}])

.controller('Assignment.Create.Ctrl', ['$scope', '$http', '$state', 'Course', function ($scope, $http, $state, Course) {
	$scope.viewName = "Create Assignment";
	$scope.assignmentInfo = {};
	$scope.assignmentInfo.name = "";
	$scope.assignmentInfo.description = "";
	$scope.assignmentInfo.maxPoints = 100;
	$scope.assignmentInfo.comments = "";
	$scope.assignmentInfo.course = "";
	$scope.assignmentInfo.dueDate = ""

	$('#dueDatePicker input').datepicker({

	});

	//Get course names for dropdown
	$http.get('/api/courses').success (function (data) {
		$scope.courses = data;
		console.log("Courses retrieved for dropdown");
	})
	.error (function () {
		console.log("Courses not retrieved");
	})

	//Scope methods
	$scope.cancel = function () { $state.go('assignmentState'); };

	$scope.postData = function () {
		$scope.nameRequired = "";

		if (!$scope.assignmentInfo.name) {
			$scope.nameRequired = "Assignment Name Required";
		}

		if ($scope.assignmentInfo.name) {
			console.log($scope.assignmentInfo);
			$http.post('/api/assignments', $scope.assignmentInfo).success(function (data) {
				console.log("Assignment successfully posted");
				Course.pushAssignment(data.course, data._id).success (function (assignment) {
					console.log("Pushed: " + assignment);
				});
				$state.go('assignmentState');
			})
			.error(function (data) {
				$scope.failed = "Assignment creation failed";
			});
		}
	};
}])

.controller('Assignment.Detail.Ctrl', ['$scope', '$http', '$state', 'Assignment', function ($scope, $http, $state, Assignment) {
	$scope.viewType = "Assignment Details";
	$scope.grades = [];
	$scope.nameEdit = false;
	$scope.pointsEdit = false;
	$scope.descEdit = false;
	$scope.commEdit = false;
	$scope.comment = "";

	$scope.editDesc = function() {
		if (!$scope.descEdit) {
			$scope.descEdit = true;
		}
		else{
			$scope.descEdit = false;
		}
	}

	$scope.editComm = function() {
		if (!$scope.commEdit) {
			$scope.commEdit = true;
		}
		else{
			$scope.commEdit = false;
		}
	}

	$scope.editName = function() {
		if (!$scope.nameEdit) {
			$scope.nameEdit = true;
		}
		else{
			$scope.nameEdit = false;
		}
	}

	$scope.editPoints = function() {
		if (!$scope.pointsEdit) {
			$scope.pointsEdit = true;
		}
		else{
			$scope.pointsEdit = false;
		}
	}

	$scope.updateAssignment = function(assignment_id) {
		debugger;
		if ($scope.comment != "") {
			$scope.assignment.comments.push($scope.comment);
		}
		$http.put('/api/assignments/' + assignment_id, $scope.assignment).success(function (data) {
			debugger;
		})
		.error(function (data) {
			debugger;
		});
		$state.go('assignmentState');
	}

	$http.get("/api/assignments/" + $state.params.assignment_id).success (function (data) {
		$scope.assignment = data;
	})
	.error (function () {
		console.log("Assignment not retrieved");
	});

	Assignment.getGrades($state.params.assignment_id).success (function (data) {
		$scope.grades = data;
	});

}]);