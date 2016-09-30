var express = require('express');
var router = express.Router();
var Client = require('instagram-private-api').V1;
var device = new Client.Device('wizardsambolton');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/wizardsambolton.json');


function sendDM(user, text) {
    // Either gain already gained session
    var session = new Client.Session(device, storage);
    // Or if we cant, create a new session
    var promise = Client.Session.create(device, storage, 'wizardsamboltn', 'sam66sam');

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
                console.log(thread.items) // -> see conversation
            });
         });
    });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
