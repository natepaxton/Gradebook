angular.module('Gradebook.Login.Ctrl', [

])

.controller('Login.Ctrl', ['$scope','$http', '$state', function ($scope, $http, $state) {
	$scope.message = "Login";
	$scope.password = "";
	$scope.userName = "";
}]);