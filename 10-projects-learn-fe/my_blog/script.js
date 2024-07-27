function showTxt() {
    var authorDiv = document.getElementById("author");
    if (authorDiv.style.display === "none") {
        authorDiv.style.display = "block";
    } else {
        authorDiv.style.display = "none";
    }
}

function showMessage() {
    var messageContent = document.getElementById("messageContent").value;
    document.getElementById("submittedMessage").innerText = "提交的留言: " + messageContent;
}
