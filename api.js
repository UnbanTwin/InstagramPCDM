var Client = require('instagram-private-api').V1;
var device = new Client.Device('wizardsambolton');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/human11404.json');
var _ = require('underscore');
var Promise = require('bluebird');
var account = require("./account.json");
// And go for login

var session = new Client.Session(device, storage);
var promise = Client.Session.create(device, storage, account.username, account.password);
function sendDM(user, text) {
	// Either gain already gained session

	// Or if we cant, create a new session


	promise.then(function(sessionInstance) {
		// Search for the User
		Client.Account.searchForUser(session, user)
		.then(function(accountInstance) {
			var userId = accountInstance.id;

			// Send a DM
			Client.Thread.configureText(session, userId, text)
			.then(function(threads) {
				var thread = threads[0];
				//thread.broadcastText(text);
				console.log(thread.items)
			});
		});
	});
}





module.exports = {
	sendMessage: function(text){sendDM("wzrdsmbltn",text);}

}
