// This code creates acustom handler for userMessages
Shiny.addCustomMessageHandler("user-messages", function(message) {
  var id = message.id, action = message.action, content = message.body, index = message.index;
  
  // message text
  // We use Shiny.renderHtml to handle the case where the user pass input/outputs in the updated content that require a new dependency not available in the 
  // page at startup. 
  if (content.hasOwnProperty("text")) {
    var text;
    if (content.text.html === undefined) {
      text = content.text;
    } else {
      text = Shiny.renderHtml(content.text.html, $([]), content.text.dependencies).html;
    } 
  }

  // Get the chat messages
  var $messages = $("#" + id);
  var $msg;

  if (action === "remove") {
    $msg = $messages.find(".direct-chat-msg").eq(index - 1);
    Shiny.unbindAll($msg);
    $msg.remove();
  } else if (action === "add") {
    var author = content.author, date = content.date, image = content.image, type = content.type;
    
    // build the new message 
    var authorWrapper, dateWrapper;
    if (type === "sent") {
      authorWrapper = '<span class="direct-chat-name float-right">' + author + '</span>';
      dateWrapper = '<span class="direct-chat-timestamp float-left">' + date + '</span>';
    } else {
      authorWrapper = '<span class="direct-chat-name float-left">' + author + '</span>';
      dateWrapper = '<span class="direct-chat-timestamp float-right">' + date + '</span>';
    }

    var newMessage = `<div class="direct-chat-infos clearfix">${authorWrapper}${dateWrapper}</div><img class="direct-chat-img" src="${image}"/><div class="direct-chat-text">${text}</div>`;
        
    // build wrapper
    var newMessageWrapper;
    if (type === "sent") {
      newMessageWrapper = '<div class="direct-chat-msg right">' + newMessage + '</div>';
    } else {
      newMessageWrapper = '<div class="direct-chat-msg">' + newMessage + '</div>';
    }
      
    // append message
    $messages.find(".direct-chat-messages").append(newMessageWrapper);
    $msg = $messages.find(".direct-chat-msg").last();
    Shiny.initializeInputs($msg[0]);
    Shiny.bindAll($msg);
  } else if (action === "update") {
    $msg = $messages.find(".direct-chat-msg").eq(index - 1)
    Shiny.unbindAll($msg);
    // today's date
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var today = d.getFullYear() + '/' +
      ((''+month).length<2 ? '0' : '') + month + '/' +
      ((''+day).length<2 ? '0' : '') + day;
      
    // we assume only text may be updated. Does not make sense to modify author/date
    
    $messages
      .find(".direct-chat-text")
      .eq(index - 1)
      .replaceWith('<div class="direct-chat-text"><small class="text-red">(modified: ' + today +')</small><br>' +  text + '</div>');
    Shiny.initializeInputs($msg[0]);
    Shiny.bindAll($msg);
  }

});
