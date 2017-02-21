$(script);

function script() {
    $("#mainSendBox").keypress(function(event) {
        if (event.which == 13) {
            console.log("Key down");
            $("#threadView").scope().send();
            $("#threadView").element('#threadView').scope().$apply();
        }
    });
}
