angular.module('Gradebook.Routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
	.state('login', {
		url: "/login",
		templateUrl: "app/views/login.html",
		controller: "Login.Ctrl"
	})

	.state('homeState', {
		url: "/",
		templateUrl: "app/views/home.html",
		controller: 'Home.Ctrl'
	})

	.state('courseState', {
		url: "/courses",
		templateUrl: "app/views/courses/index.html",
		controller: 'Course.Ctrl'
	})

	.state('courseCreate', {
		url: "/courses/create",
		templateUrl: "app/views/courses/create.html",
		controller: 'Course.Create.Ctrl'
	})

	.state('studentState', {
		url: "/students",
		templateUrl: "app/views/students/index.html",
		controller: "Student.Ctrl"
	})

	.state('studentCreate', {
		url: "/students/create",
		templateUrl: "app/views/students/create.html",
		controller: "Student.Create.Ctrl"
	})

	.state('studentDetail', {
		url: "/students/:student_id",
		templateUrl: "app/views/students/detail.html",
		controller: "Student.Detail.Ctrl"
	})

	.state('assignmentState', {
		url: "/assignments",
		templateUrl: "app/views/assignments/index.html",
		controller: "Assignment.Ctrl"
	})

	.state('assignmentCreate', {
		url: "/assignments/create",
		templateUrl: "app/views/assignments/create.html",
		controller: "Assignment.Create.Ctrl"
	})

	.state('coursesDetail', {
		url: "/courses/:course_id",
		templateUrl: "app/views/courses/detail.html",
		controller: "Course.Detail.Ctrl"
	})

	.state('assignmentDetail', {
		url: "/assignments/:assignment_id",
		templateUrl: "app/views/assignments/detail.html",
		controller: "Assignment.Detail.Ctrl"
	})

	.state('gradeAssignment', {
		url: '/assignments/:assignment_id/enterGrades',
		templateUrl: "app/views/grades/enterGrades.html",
		controller: "Grade.Ctrl"
	})

	.state('gradeDetail', {
		url: '/assignments/:assignment_id/grades',
		templateUrl: 'app/views/grades/detail.html',
		controller: 'Grade.Detail.Ctrl'
	});

	$locationProvider.html5Mode(true).hashPrefix('!');
});