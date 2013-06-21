function signInOutSetup(){
	$("#signInOut").click(function(){
        signIn()
    })
    
    $("#username").keypress(function(event) {
        if( event.which == 13 ) {
            signIn()
       }
    })
}

function signIn(){
	var username = getUserName();
	if($("#signInOut").val() == "Sign In" && username!=""){	
		$("#signInOut").val("Sign Out")		
		
		displayComposeTweet(username)
		
		ajax("SignIn",{"username":username},function(returnData) {});
		
		$("#username").hide();
		$("#signInOut").hide();
		goToHome()
	}
}
function signOut(){
		$("#signInOut").val("Sign In")
		$("#composeTweet").empty();
		$("#username").show();
		$("#signInOut").show();
}