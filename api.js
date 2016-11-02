var Client = require('instagram-private-api').V1;
var device = new Client.Device('wizardsambolton');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/human11404.json');
var _ = require('underscore');
var Promise = require('bluebird');
var account = require("./account.json");
// And go for login

var session = new Client.Session(device, storage);
var promise = Client.Session.create(device, storage, account.username, account.password);






module.exports = {
	sendMessage: function(user,text,callback) {
		promise.then(function(sessionInstance) {
			// Search for the User
			Client.Account.searchForUser(session, user)
			.then(function(accountInstance) {
				var userId = accountInstance.id;
				Client.Thread.configureText(session, userId, text)
				.then(function(threads) {
					callback();
				});
			});
		});
	}

}
