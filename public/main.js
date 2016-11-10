$(main);
var toUsers = [];

function main() {

	$.get("/api/list/following",function(followers){
		console.log(followers);
		$.get('/templates/list-following.mu', function(template) {
			var rendered = Mustache.render(template, {data: followers});
			$('#left').html(rendered);
			onReady();

		});
	});
	$("#send-message-form").submit(function(){
		/*$.get("/api/send/message?message=test111&users=3088383945",function(){
		console.log("sent!");
	});*/
	var message = $("#send-message-form input").val();
	$.post("/api/send/message", { users:toUsers.join(","),message:message })
	.done(function(data) {
		console.log("It works!");
	});

	return false;
});

};
function onReady() {
	$(".account").click(function(){
		var testID = $(this).data("id");
		if(toUsers.indexOf(testID) == -1) {
			toUsers.push(testID);
		}else {
			console.log("Duplicate ID");
		}

		$("#to-users").html(toUsers.join(" "));
	});
}
