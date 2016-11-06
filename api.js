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
		cleaned.push(data[i]._params);

	};
	console.log(cleaned);
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
	}

}
