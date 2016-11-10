$(main);
function main() {
	$.get("/api/list/following",function(followers){
		console.log(followers);
		$.get('/templates/list-following.mu', function(template) {
			var rendered = Mustache.render(template, {data: followers});
			$('#left').html(rendered);
		});
	});
	$("#send-message-form").submit(function(){
		/*$.get("/api/send/message?message=test111&users=3088383945",function(){
		console.log("sent!");
	});*/
	var message = $("#send-message-form input").val();
	$.post( "/api/send/message", { users:"3088383945",message:message })
	.done(function(data) {
		console.log("It works!");
	});

	return false;
});

}
