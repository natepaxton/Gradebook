angular.module('Gradebook.Students.Ctrl', [

])

.controller('Student.Ctrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Students";
	$http.get("/api/students").success (function (data) {
		$scope.studentData = data;
		console.log("Students retrieved");
	})
	.error (function () {
		console.log("Students not retrieved");
	});

	$scope.remove = function (studentId) {
		$http.delete("/api/students/" + studentId);
		$state.go($state.current, {}, {reload: true});
	};
}])

.controller('Student.Create.Ctrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewName = "Create Student";
	$scope.studentInfo = {};
	$scope.studentInfo.firstName = "";
	$scope.studentInfo.lastName = "";
	$scope.studentInfo.phoneNumber = "";
	$scope.studentInfo.email = "";
	$scope.studentInfo.comments = "";

	//Scope methods
	$scope.cancel = function () { $state.go('studentState'); };

	$scope.postData = function () {
		$scope.nameRequired = "";
		$scope.emailRequired = "";

		if (!$scope.studentInfo.firstName || !$scope.studentInfo.lastName) {
			$scope.nameRequired = "Student First and Last Name Required";
		}

		if (!$scope.studentInfo.email) {
			$scope.emailRequired = "Email Required";
		}

		if ($scope.studentInfo.firstName && $scope.studentInfo.lastName && $scope.studentInfo.email) {
			console.log($scope.studentInfo);
			$http.post('/api/students', $scope.studentInfo).success(function (data) {
				console.log("Student successfully posted");
				$state.go('studentState');
			})
			.error(function (data) {
				$scope.failed = "Student creation failed";
			});
		}
	};
}])


.controller('Student.Detail.Ctrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Student Details";
	$http.get('/api/students/' + $state.params.student_id).success(function (data) {
		debugger;
		$scope.student = data;
	})
	.error(function (err) {
		console.log(err);
	});
}]);