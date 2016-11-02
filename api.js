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
		console.log(session);
		Client.Account.searchForUser(session,account.username)
		.then(function(accountInstance) {
			var feed = new Client.Feed.AccountFollowing(session,accountInstance.id);
			feed.get().then(function(data) {
				console.log("Reponse from api: ");
				console.log(data);
				var accounts = [];
				for(i in data) {
					accounts.push(data[i]._params);
				};
				callback(accounts);
			});
		})

	}

}
