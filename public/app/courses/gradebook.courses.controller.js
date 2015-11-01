angular.module('Gradebook.Courses.Ctrl', [
	'Gradebook.Courses.Service'
])

.controller('Course.Ctrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Courses";
	$http.get("/api/courses").success (function (data){
		$scope.courseData = data;
		console.log("Courses retrieved");
	})
	.error (function(){
		console.log("Courses not retrieved");
	});

	$scope.remove = function (courseId) {
		$http.delete("/api/courses/" + courseId);
		$state.go($state.current, {}, {reload: true});
	};
}])

.controller('Course.Create.Ctrl', ['$scope', '$http', '$state', 'Course', function ($scope, $http, $state, Course) {
	$scope.viewName = "Create Course";
	$scope.courseInfo = {};
	$scope.courseInfo.name = "";
	$scope.courseInfo.courseNum = "";
	$scope.courseInfo.comments = "";

	//Arrays for student addition
	$scope.courseInfo.studentsIn = [];
	$scope.courseInfo.studentsOut = [];
	Course.getAllStudents().success (function (data) {
		for (var i=0; i<data.length; i++) { 
			$scope.courseInfo.studentsOut.push(data[i]);
		}
	});

	//Scope methods
	$scope.cancel = function () { $state.go('courseState'); };

	$scope.toggleIn = function (student, i) {
		$scope.courseInfo.studentsIn.push($scope.courseInfo.studentsOut.splice(i, 1)[0]);
	}

	$scope.toggleOut = function (student) {
		$scope.courseInfo.studentsIn.splice($scope.courseInfo.studentsIn.indexOf(student), 1);
		$scope.courseInfo.studentsOut.push(student);
	}

	$scope.postData = function () {
		$scope.nameRequired = "";
		$scope.numRequired = "";

		if (!$scope.courseInfo.name) {
			$scope.nameRequired = "Course Name Required";
		}

		if (!$scope.courseInfo.courseNum) {
			$scope.numRequired = "Course Number Required";
		}

		if ($scope.courseInfo.name && $scope.courseInfo.courseNum) {
			console.log($scope.courseInfo);
			$http.post('/api/courses', $scope.courseInfo).success(function (data) {
				console.log("Course successfully posted");

				for (var i=0; i<$scope.courseInfo.studentsIn.length; i++) {
					debugger;
					Course.updateStudent($scope.courseInfo.studentsIn[i]._id, data._id);
				}

				$state.go('coursesDetail', { course_id: data._id });
			})
			.error(function (data) {
				$scope.failed = "Course creation failed";
			});
		}
	};
}])

.controller('Course.Detail.Ctrl', ['$scope', '$http', '$state', '$stateParams', 'Course', function ($scope, $http, $state, $stateParams, Course) {
	//Scope properties
	$scope.viewType = "Course Details";
	$scope.pointTotal = 0;
	$scope.addStudentButton = false;
	$scope.toggleNameEdit = false;
	$scope.toggleCRNEdit = false;
	$scope.allStudents = [];
	$scope.studentsOut = [];

	//Scope methods
	$scope.editName = function() {
		if (!$scope.toggleNameEdit) {
			$scope.toggleNameEdit = true;
		}
		else{
			$scope.toggleNameEdit = false;
		}
	}

	$scope.editCourseNum = function() {
		if (!$scope.toggleCRNEdit) {
			$scope.toggleCRNEdit = true;
		}
		else{
			$scope.toggleCRNEdit = false;
		}
	}

	$scope.toggleIn = function (student, i) {
		$scope.course.students.push($scope.studentsOut.splice(i, 1)[0]);
	}

	$scope.toggleOut = function (student) {
		$scope.course.students.splice($scope.course.students.indexOf(student), 1);
		$scope.studentsOut.push(student);
	}

	$scope.toggleState = function() {
		if ($scope.addStudentButton) {
			$scope.addStudentButton = false;
		}
		else {
			$scope.addStudentButton = true;
		}
	}

	$scope.updateCourse = function(course_id) {
		debugger;
		$http.put('/api/courses/' + course_id, $scope.course).success(function (data) {
			debugger;
		})
		.error(function (data) {
			debugger;
		});
		$state.go('courseState');
	}

	//Use services
	Course.getStudentsOut($stateParams.course_id).success (function (data) {
		for (var i=0; i<data.length; i++) {
			$scope.studentsOut.push(data[i]);
		}
	});

	// Course.getStudentsIn($stateParams.course_id).success (function (data) {
	// 	for (var i=0; i<data.length; i++) {
	// 		$scope.course.students.push(data[i]);
	// 	}
	// });

	$http.get("/api/courses/" + $state.params.course_id).success (function (data) {
		$scope.course = data;
		for (var i=0; i<$scope.course.assignments.length; i++) {
			$scope.pointTotal += $scope.course.assignments[i].maxPoints;
		}
		console.log(data);
	})
	.error (function () {
		console.log("Course not retrieved");
	});


}]);