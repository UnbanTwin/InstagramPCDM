var app = angular.module("pcdm",[]);
//thread and new
app.service("thread",function($rootScope){
	this.data = {
		id: "340282366841710300949128113874027408665",
		mode: "thread"
	};
	this.reload = function(x) {
		console.log("Reload timer starting");
		setTimeout(function(){
			console.log("Reload initiated");
			$rootScope.$emit("reloadThread");
		},x)
	};
});
app.service("friends",function($rootScope,$http){
	this.data = [];
	var friendsService = this;
	$http.get("/api/list/following").then(function(res){
		friendsService.data = res.data;
		$rootScope.$emit("reloadFriends");

	});

});
app.controller("new",function($scope,thread) {
	$scope.triggerNew = function() {
		thread.data.mode = "new";
	}
});
app.controller("newThread",function($scope,$rootScope,friends,thread){
	$scope.data = {};
	$scope.data.selected = [];
	$scope.thread = thread;
	$scope.update = function(){
		console.log("Update");
		$scope.data.matches = [];
		if($scope.pattern == ""){
			return;
		};
		for (i=0;i<friends.data.length;i++){
			if(friends.data[i].username.indexOf($scope.pattern) != -1) {
				$scope.data.matches.push(friends.data[i]);
			};
		}
	};
	$scope.selectUser = function(user) {
		for (i in $scope.data.selected){
			if (user.id == $scope.data.selected[i].id) {
				return;
			}
		}
		$scope.data.selected.push(user);
		console.log($scope.data.selected);
	}

});

app.controller("friendsList",function($scope,$rootScope,friends){
	$scope.data = friends.data;
	$rootScope.$on("reloadFriends",function(){
		$scope.data = friends.data;
	});

});

app.controller("messageInput",function($scope,$http,thread,$rootScope){
	$scope.send = function() {
		$http.post("/api/send/threads",{id: thread.data.id, message: $scope.contents}).then(function(res){
			thread.reload(2000);
			$scope.contents = "";
		});
	}
});

app.controller("threadsList",function($scope,$http,thread,$rootScope){
	$scope.data = [];

	$scope.selectThread = function(id) {

		thread.data.id = id;
		$rootScope.$emit("changeThread");
	};
	$http.get("/api/list/threads").then(function(res){
		$scope.data = res.data;
	});
});

app.controller("threadView",function($scope,$http,thread,$rootScope){
	$scope.data = [];
	$scope.thread = thread;
	function fetchThread() {
		console.log("Fetching thread");
		$http.get("/api/show/thread/" + thread.data.id).then(function(res){
			$scope.data = res.data;
			$scope.data.reverse();
		});
	};
	fetchThread();
	$rootScope.$on("changeThread",fetchThread);
	$rootScope.$on("reloadThread",fetchThread);
});

console.log("Hello World!");
