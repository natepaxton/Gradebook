angular.module('Gradebook.Home.Ctrl', [

])

.controller('Home.Ctrl', ['$scope', '$http', '$state', function ($scope, $http, $state) { 
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
	var donutLabels = [];
	var donutData = [];
	var colors = ['#ff865c', '#ffd777', '#43b1a9', '#68dff0', '#797979']

	$http.get('/api/assignments').success (function (data) {
		$scope.assignData = data;
		console.log("Assignments retrieved");
		$scope.assignCount = data.length;

		//Create the data and donut chart
		var assignGraphData = [];
		for (var i=0; i<data.length; i++) {
			assignGraphData.push({"label": data[i].name, "value": data[i].maxPoints});
		}
		assignDonut.setData(assignGraphData);
	});

	var assignDonut = Morris.Donut({
		element: 'assignmentChart',
		data: [{"label": "", "value": ""}],
		colors: [
		'#ff865c',
		'#ffd777',
		'#43b1a9',
		'#68dff0',
		'#797979'
		],
		resize: true
	});
}]);