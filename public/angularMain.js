var app = angular.module("pcdm",[]);
app.factory("info",function(){
	return {x: 5};
});
app.controller("friendsList",function($scope,$http){
	$scope.data = [];
	$http.get("/api/list/following").then(function(res){
		$scope.data = res.data;
	});

});
app.controller("threadsList",["$scope","$http","info",function($scope,$http,info){
	$scope.data = [];

	$scope.x = info.x;
	$scope.$watch("info.x", function(){
		console.log("Threads list updating")
	});
	$http.get("/api/list/threads").then(function(res){
		$scope.data = res.data;

	});
}]);
app.controller("threadView",function($scope,$http){
	$scope.data = [];
	$http.get("/api/show/thread/340282366841710300949128113874027408665").then(function(res){
		$scope.data = res.data;
	});
});
app.controller("testCom",["$scope","info",function($scope,info){
	$scope.data = [];
	$scope.update = function() {
		console.log("Updated x value");
		info.x++;
	}

}]);
console.log("Hello World!");
