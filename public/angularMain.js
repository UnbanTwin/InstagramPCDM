var app = angular.module("pcdm",[]);
app.controller("friendsList",function($scope,$http){
	$scope.data = [];
	$http.get("/api/list/following").then(function(res){
		$scope.data = res.data;
	});

});
app.controller("threadsList",function($scope,$http){
	$scope.data = [];
	$http.get("/api/list/threads").then(function(res){
		$scope.data = res.data;
	});
});
console.log("Hello World!");
