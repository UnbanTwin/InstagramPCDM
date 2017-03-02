var app = angular.module("pcdm",[]);

//thread and new
app.service("thread",function($rootScope){
	this.data = {
		id: "340282366841710300949128113874027408665",
		mode: "thread",
		firstView: true
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
app.controller("new",function($scope,thread,$rootScope) {
	$scope.triggerNew = function() {
		thread.data.mode = "new";
		$rootScope.showButton = false;
	}
});
app.controller("newThread",function($scope,$rootScope,friends,thread,$http){
	$scope.data = {};
	$scope.contents = "";
	$scope.data.selected = [];
	$scope.thread = thread;
	$scope.cancel = function(){
		$rootScope.showButton = true;
		thread.data.mode = 'thread'
		$scope.data.selected = [];
		$scope.pattern = "";
		$scope.data.matches = [];
	};
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
	};
	$scope.removeUser = function(user) {
		console.log("Removing user");
		var index = $scope.data.selected.indexOf(user);
		if (index != -1){
			$scope.data.selected.splice(index,1);
		}

	};
	$scope.send = function() {
		$rootScope.$emit("resetPolling");
		$rootScope.showButton = true;
		var ids = [];
		for (i in $scope.data.selected) {
			ids.push($scope.data.selected[i].id);
		};
		$http.post("/api/send/message",{users: ids.join(","), message: $scope.contents}).then(function(res){
			console.log(res);
			$scope.contents = "";
			$http.get("/api/list/threads").then(function(res){
				console.log("firing");
				console.log(res.data);
				thread.data.id = res.data[0].id;
				thread.data.mode = "thread";
				$rootScope.$emit("changeThread");
				$rootScope.$emit("resetThreadList");
			});
		});
	}

});

app.controller("friendsList",function($scope,$rootScope,friends){
	$scope.data = friends.data;
	$rootScope.$on("reloadFriends",function(){
		$scope.data = friends.data;
	});

});


app.controller("threadsList",function($scope,$http,thread,$rootScope){
	$scope.data = [];
	$scope.selectThread = function(id) {
		thread.data.mode = "thread";
		thread.data.id = id;
		thread.data.firstView = true;
		$rootScope.$emit("resetPolling");
		console.log("Picked new thread");
		$rootScope.showButton = true;
		$rootScope.$emit("changeThread");

	};
	$rootScope.$on("resetThreadList",function(){
		$http.get("/api/list/threads").then(function(res){
			console.log(res.data);
			$scope.data = res.data;
		});
	});
	$rootScope.$emit("resetThreadList");

});

app.controller("threadView",function($scope,$http,thread,$rootScope,$anchorScroll){
	$scope.data = [];
	$scope.thread = thread;

	var timerID = null;
	var pollingTime = 1000;
	$rootScope.$on("resetPolling",function(){
		console.log("reset timer to 1000");
		pollingTime = 1000;
	});
	$scope.send = function() {
		$rootScope.$emit("resetPolling");
		$http.post("/api/send/threads",{id: thread.data.id, message: $scope.contents}).then(function(res){
			thread.reload(2000);
			$scope.contents = "";
		});
	};

	function fetchThread() {
		console.log("Fetching thread");
		console.log(thread.data);
		$http.get("/api/show/thread/" + thread.data.id).then(function(res){
			$scope.data = res.data;
			$scope.data.reverse();
			insertDividers($scope.data);
			if (timerID){
				clearTimeout(timerID);
			}
			console.log("Auto refreshed after "+ pollingTime);
			pollingTime += 2000;
			timerID = setTimeout(fetchThread,pollingTime);
			if (thread.data.firstView) {
				setTimeout(function(){
					document.getElementById("innerChatWindow").scrollTop = document.getElementById("innerChatWindow").scrollHeight
				},1);
				thread.data.firstView = false;
			}
		});
	};

	function insertDividers (list) {
		var startId = -1;
		for(var i =0; i < list.length; i++){
			var item = list[i];
			if(item.accountId != startId) {
				startId = item.accountId;
				var divider = {type:"divider", account: item.account};
				list.splice(i,0, divider);
			}
		}
	}
	fetchThread();
	$rootScope.$on("changeThread",fetchThread);
	$rootScope.$on("reloadThread",fetchThread);
});

console.log("Hello World!");
