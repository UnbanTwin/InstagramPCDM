var async = require('async');
var Client = require('instagram-private-api').V1;
var device = new Client.Device('human11404');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/human11404.json');
var _ = require('underscore');
var Promise = require('bluebird');
var account = require("./account.json");
// And go for login
var session = new Client.Session(device, storage);
var promise = Client.Session.create(device, storage, account.username, account.password);
promise.then(function(sessionInstance) {
	console.log("Instagram connection established");
});
var cachedUsers = {};
function clearCache(){
	cachedUsers = {};
	setTimeout(clearCache,1000*60*60);
	console.log("Cleared User Cache");
};
clearCache();
// function cleanArray(data){
// 	var cleaned = [];
// 	for(i in data) {
// 		cleaned.push(data[i]._params);
//
// 	};
// 	return cleaned;
// };

function cleanArray(data){
	var cleaned = [];
	for(i in data) {

		data[i] = removeSession(data[i]);
		//console.log(data[i]);
		if(data[i] != null && typeof data[i] != "undefined"){
			cleaned.push(data[i]._params);
		}

	};
	//console.log(cleaned);
	return cleaned;
};

function removeSession(item) {

	if (typeof item != "object" || item == null) {
		return item;

	}
	if(typeof item._session == "object") {
		delete item._session;
	}

	for (key in item) {
		if(typeof item[key] == "object"){
			item[key] = removeSession(item[key]);
		}
	}
	return item;
};


module.exports = {
	sendMessage: function(listOfUsers,text,callback) {
		//Client.Account.searchForUser(session, user)
		//.then(function(accountInstance) {
		//var userId = accountInstance.id;
		Client.Thread.configureText(session, listOfUsers, text)
		.then(function(threads) {
			callback();
		});
		//});

	},
	showThread: function(threadId,callback){
		Client.Thread.getById(session,threadId)
		.then(function(thread){
			getUserObjects(cleanArray(thread.items),function(accounts){
				var items = cleanArray(thread.items);
				for(i=0;i<items.length;i++){
					items[i].account = accounts[items[i].accountId.toString()];
				}
				callback(items);
			});

		});
	},
	sendToThread: function(threadId,text,callback) {
		Client.Thread.getById(session,threadId)
		.then(function(thread){
			thread.broadcastText(text);
			callback();
		});
	},
	listFollowing: function(callback) {

		Client.Account.searchForUser(session,account.username)
		.then(function(accountInstance) {
			var feed = new Client.Feed.AccountFollowing(session,accountInstance.id);
			feed.get().then(function(data) {


				callback(cleanArray(data));
			});
		});

	},
	listThreads: function(callback){
		var feed = new Client.Feed.Inbox(session);
		feed.get().then(function(data){
			callback(cleanArray(data));

		});
	},
	userByID: function (Id,callback) {
		getUserObject(Id,callback);
	}

};
//Get user object from cache OR Instagram API
function getUserObject(Id,callback) {
	Id = Id.toString();
	if(cachedUsers[Id] != undefined) {
		console.log("User retreived from cache");
		return callback(cachedUsers[Id]);
	}else{
		Client.Account.getById(session,Id)
		.then(function(data){
			console.log("User fetched from server");
			cachedUsers[Id] = data._params;
			callback(data._params);
		});
	}
};
//Get unique list of user IDs from thread
function IdsFromThread(items) {
	var Ids = [];
	for(i=0;i<items.length;i++) {
		if(Ids.indexOf(items[i].accountId) == -1){
			Ids.push(items[i].accountId);
		}
	}
	return Ids;
};
//Given thread items, get all user objects in thread
function getUserObjects(items,callback){
	var Ids = IdsFromThread(items);
	async.map(Ids,function(ID,callback){
		getUserObject(ID,function(user){
			callback(null,user);
		});

	},function(err,data){
		var accounts = {};
		for (i=0;i<data.length;i++){
			accounts[data[i].id] = data[i];
		}
		callback(accounts);
	});

}
