var gradebookApp = angular.module('gradebook', ['ui.router']);

gradebookApp.controller('LoginController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Login";
}]);

gradebookApp.controller('HomeController', ['$scope', '$http', '$state', function ($scope, $http, $state) { 
	$scope.viewType = "Semester";
	var graphData = [];
	var assignGraphData = [];

	$http.get("/api/courses").success (function (data){
		$scope.courseData = data;
		console.log("Courses retrieved");
		$scope.courseCount = data.length;

		var barLabels = [];
		var barStudentData = [];
		var barAssData = [];

		//Push names into labels
		for (var i=0; i<$scope.courseData.length; i++) {
			barLabels.push($scope.courseData[i].name);
			barStudentData.push($scope.courseData[i].students.length);
			barAssData.push($scope.courseData[i].assignments.length);
		}

		var barData = {
			labels: barLabels,
			//Push data to datasets
			datasets: [
			{
				label: "Students",
				fillColor: "rgba(104,223,240,0.5)",
				strokeColor: "rgba(104,223,240,0.8)",
				highlightFill: "rgba(104,223,240,0.75)",
				highlightStroke: "rgba(104,223,240,1)",
				data: barStudentData
			},
			{
				label: "Assignments",
				fillColor: "rgba(255,134,92,0.5)",
				strokeColor: "rgba(255,134,92,0.8)",
				highlightFill: "rgba(255,134,92,0.75)",
				highlightStroke: "rgba(255,134,92,1)",
				data: barAssData
			}]
		};

		var ctx = document.getElementById("courseBar").getContext("2d");
		var courseBarChart = new Chart(ctx).Bar(barData);
	})
	.error (function(){
		console.log("Courses not retrieved");
	});

	//Get the assignments
	$http.get('/api/assignments').success (function (data) {
		$scope.assignData = data;
		console.log("Assignments retrieved");
		$scope.assignCount = data.length;

		// for (var i=0; i<data.length; i++) {
		// 	assignGraphData.push({"label": data[i].name, "value": data[i].maxPoints});
		// }
		// assignDonut.setData(assignGraphData);
	});

	// var barData = {
		
	// }

	// var assignDonut = Morris.Donut({
	// 	element: 'assignmentChart',
	// 	data: [{"label": "", "value": ""}],
	// 	colors: [
	// 	'#ff865c',
	// 	'#ffd777',
	// 	'#43b1a9',
	// 	'#68dff0',
	// 	'#797979'
	// 	],
	// 	resize: true
	// });

	// var donut = Morris.Donut({
	// 	element: 'studentChart',
	// 	data: [{"label": "", "value": ""}],
	// 	colors: [
	// 	'#ff865c',
	// 	'#ffd777',
	// 	'#43b1a9',
	// 	'#68dff0',
	// 	'#797979'
	// 	],
	// 	resize: true
	// });
}]);

//Course controllers
gradebookApp.controller('CourseController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
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
}]);

gradebookApp.controller('CourseCreateCtrl', ['$scope', '$http', '$state', 'courseFactory', function ($scope, $http, $state, courseFactory) {
	$scope.viewName = "Create Course";
	$scope.courseInfo = {};
	$scope.courseInfo.name = "";
	$scope.courseInfo.courseNum = "";
	$scope.courseInfo.comments = "";

	//Arrays for student addition
	$scope.courseInfo.studentsIn = [];
	$scope.courseInfo.studentsOut = [];
	courseFactory.getAllStudents().success (function (data) {
		for (var i=0; i<data.length; i++) { 
			$scope.courseInfo.studentsOut.push(data[i]);
		}
	});

	//Scope methods
	$scope.cancel = function () { $state.go('courseState'); };

	$scope.toggleIn = function (student, i) {
		$scope.courseInfo.studentsIn.push($scope.courseInfo.studentsOut.splice(i, 1)[0]);
	}

	$scope.toggleOut = function (student, i) {
		$scope.courseInfo.studentsOut.push($scope.courseInfo.studentsIn.splice(i, 1));
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
				$state.go('courseState');
			})
			.error(function (data) {
				$scope.failed = "Course creation failed";
			});
		}
	};
}]);

gradebookApp.controller('CourseDetailCtrl', ['$scope', '$http', '$state', '$stateParams', function ($scope, $http, $state) {
	$scope.viewType = "Course Details";
	$scope.pointTotal = 0;

	$http.get("/api/courses/" + $state.params.course_id).success (function (data) {
		$scope.course = data.course;
		for (var i=0; i<$scope.course.assignments.length; i++) {
			$scope.pointTotal += $scope.course.assignments[i].maxPoints;
		}
		console.log(data);
	})
	.error (function () {
		console.log("Course not retrieved");
	});
}]);

//Student controllers
gradebookApp.controller('StudentCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
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
}]);

gradebookApp.controller('StudentCreateCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
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
}]);

//Assignment controllers
gradebookApp.controller('AssignmentCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
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
}]);

gradebookApp.controller('AssignmentCreateCtrl', ['$scope', '$http', '$state', 'courseFactory', function ($scope, $http, $state, courseFactory) {
	$scope.viewName = "Create Assignment";
	$scope.assignmentInfo = {};
	$scope.assignmentInfo.name = "";
	$scope.assignmentInfo.description = "";
	$scope.assignmentInfo.maxPoints = "";
	$scope.assignmentInfo.comments = "";
	$scope.assignmentInfo.course = "";
	$scope.assignmentInfo.dueDate = "";

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
				courseFactory.pushAssignment(data.course, data._id).success (function (data) {
					console.log("Pushed: " + data);
				});
				$state.go('assignmentState');
			})
			.error(function (data) {
				$scope.failed = "Assignment creation failed";
			});
		}
	};
}]);

gradebookApp.controller('AssignmentDetailCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Assignment Details";

	$http.get("/api/assignments/" + $state.params.assignment_id).success (function (data) {
		debugger;
		$scope.assignment = data;
		console.log(data);
	})
	.error (function () {
		console.log("Assignment not retrieved");
	});
}]);

//UI Routes
gradebookApp.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('login', {
		url: "/login",
		templateUrl: "../../app/views/login.html",
		controller: "LoginController"
	})

	.state('homeState', {
		url: "",
		templateUrl: "../../app/views/home.html",
		controller: 'HomeController'
	})

	.state('courseState', {
		url: "/courses",
		templateUrl: "../../app/views/courses/index.html",
		controller: 'CourseController'
	})

	.state('courseCreate', {
		url: "/courses/create",
		templateUrl: "../../app/views/courses/create.html",
		controller: 'CourseCreateCtrl'
	})

	.state('studentState', {
		url: "/students",
		templateUrl: "../../app/views/students/index.html",
		controller: "StudentCtrl"
	})

	.state('studentCreate', {
		url: "/students/create",
		templateUrl: "../../app/views/students/create.html",
		controller: "StudentCreateCtrl"
	})

	.state('assignmentState', {
		url: "/assignments",
		templateUrl: "../../app/views/assignments/index.html",
		controller: "AssignmentCtrl"
	})

	.state('assignmentCreate', {
		url: "/assignments/create",
		templateUrl: "../../app/views/assignments/create.html",
		controller: "AssignmentCreateCtrl"
	})

	.state('coursesDetail', {
		url: "/courses/:course_id",
		templateUrl: "../../app/views/courses/detail.html",
		controller: "CourseDetailCtrl"
	})

	.state('assignmentDetail', {
		url: "/assignments/:assignment_id",
		templateUrl: "../../app/views/assignments/detail.html",
		controller: "AssignmentDetailCtrl"
	});
});

//Factories and services
gradebookApp.factory('courseFactory', function ($http) {
	var courseFactory = {};

	courseFactory.pushAssignment = function (course_id, assignment_id) {
		return $http.put('/api/courses/' + course_id + '/assignments/' + assignment_id);
	};

	courseFactory.getAllStudents = function () {
		return $http.get('/api/students');
	};

	return courseFactory;
});