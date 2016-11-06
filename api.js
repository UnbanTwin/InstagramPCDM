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
function cleanArray(data){
	var cleaned = [];
	for(i in data) {
		cleaned.push(data[i]._params);

	};
	return cleaned;
};

function cleanArrayThreads(data){
	var cleaned = [];
	for(i in data) {
		var item = data[i]._params;
		delete item.inviter._session;
		cleaned.push(item);

	};
	return cleaned;
};


module.exports = {
	sendMessage: function(user,text,callback) {
		Client.Account.searchForUser(session, user)
		.then(function(accountInstance) {
			var userId = accountInstance.id;
			Client.Thread.configureText(session, userId, text)
			.then(function(threads) {
				callback();
			});
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
			console.log("Reponse from api: ");
			console.log(data[0]._params);
			callback(cleanArrayThreads(data));

		});
	}

}
