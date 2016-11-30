var app = angular.module("pcdm",[]);
app.service("thread",function(){
	this.data = {id: "340282366841710300949128113874027408665"};
});
app.controller("friendsList",function($scope,$http){
	$scope.data = [];
	$http.get("/api/list/following").then(function(res){
		$scope.data = res.data;
	});

});
app.controller("threadsList",function($scope,$http,thread,$rootScope){
	$scope.data = [];
	$scope.selectThread = function(id) {
		console.log(id);
		thread.data.id = id;
		$rootScope.$emit("changeThread");
	};
	$http.get("/api/list/threads").then(function(res){
		$scope.data = res.data;
	});
});
app.controller("threadView",function($scope,$http,thread,$rootScope){
	$scope.data = [];
	function fetchThread() {
		$http.get("/api/show/thread/" + thread.data.id).then(function(res){
			$scope.data = res.data;
		});
	};
	fetchThread();
	$rootScope.$on("changeThread",fetchThread);
});

console.log("Hello World!");
