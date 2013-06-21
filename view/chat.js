var timer = setInterval(function(){getChatConversation()}, 1000);
var chatShowing = true;

function chatSetup(){
	$("#chatTitleBar span").click(showHideChat);


    $("#sendChat").click(function(event) {
       sendChat();
    });

    $("#chatEnterArea").keypress(function(event) {
		if(event.which == 13 && !event.shiftKey) {
			// Shift key to add new line
           event.preventDefault();
           sendChat();
		}
    })

   // Load up initial chat log
	getChatConversation() 
}

function sendChat() {
    var phrase = $("#chatEnterArea").val();
    $("#chatEnterArea").val("");
    clearInterval(timer);
    timer = null;
    pushChatConversation(phrase);
}

function showHideChat() {
  if(chatShowing) {
    chatShowing = false;
    $("#chatBox").addClass("hideChat");
  } else {
    chatShowing = true;
    $("#chatBox").removeClass("hideChat");
  }
}

function getChatConversation() {
   ajax("getComments", {}, function(returnData) {
       var commentsObject = JSON.parse(returnData)["conversation"];

       updateChatConversation(commentsObject);
   });
}

function pushChatConversation(newChatText) {
   ajax("pushComments", {"comment":newChatText}, function(returnData) {
      var commentsObject = JSON.parse(returnData)["conversation"];

      updateChatConversation(commentsObject);
   });
}

function updateChatConversation(commentsArray) {
   //$("#chatLog").html("");
    for(var i = 0; i < commentsArray.length; i++) {
        var p = $("<p>");
        if(commentsArray[i]["user"] == "") {
        commentsArray[i]["user"] = "Guest";
        }
        var userComment = "<b>" + commentsArray[i]["user"] + "</b>: " + commentsArray[i]["comment"];
        p.html(userComment);
        $("#chatLog").append(p);
    }
    $("#chatLog").animate({ scrollTop: $("#chatLog").attr("scrollHeight") }, 2000); 
    if(!timer) {
        timer = setInterval(function(){getChatConversation()}, 5000);
    }
}