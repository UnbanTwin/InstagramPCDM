$(main);
function main() {
	$.get("/api/list/following",function(followers){
		console.log(followers);
		$.get('/templates/list-following.mu', function(template) {
			var rendered = Mustache.render(template, {data: followers});
			$('#left').html(rendered);
		});
	});

}
