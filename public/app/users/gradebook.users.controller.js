angular.module('Gradebook.Users.Ctrl', [])

.controller('User.Ctrl', ['$scope', '$http', function ($scope, $http) {
	$scope.viewType = "User";
}])

.controller('User.Create.Ctrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Register a new user";
	$scope.user = {};
	$scope.userName = "";
	$scope.password = "";
	$scope.email = "";

	

}]);