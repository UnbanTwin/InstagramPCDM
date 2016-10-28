var Client = require('instagram-private-api').V1;
var device = new Client.Device('wizardsambolton');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/human11404.json');
var _ = require('underscore');
var Promise = require('bluebird');
// And go for login
Client.Session.create(device, storage, 'wzrdsmbltn', 'Sam66sam')
.then(function(session) {

	/*var feed = new Client.Feed.Inbox(session, 100);
	feed.all().then(function(threads) {
	    if (threads.length > 0)
	        throw new Error("..... no messeges in inbox ....")
	    return threads[0].configureText("text to someone")
	})
	.then(function(){
	    console.log("text sended!")
	})*/
});

function sendDM(user, text) {
	// Either gain already gained session
	var session = new Client.Session(device, storage);
	// Or if we cant, create a new session
	var promise = Client.Session.create(device, storage, 'human11404', '');

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


sendDM("wzrdsmbltn","test");
