chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        //chrome.runtime.sendMessage({"message": "open_new_tab", "url": "https://read.amazon.com"});
        // if on read.amazon.com
        readBooks()
        // else
        // please go to read.amazon.com and try again

      }
    }
  );

  function readBooks() {
    // alert('The DOM is loaded');
    var db = openDatabase('K4W', '3', 'down_to_read', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM bookdata;', [], function(tx, results) { 
            var bookTitle = results.rows.item(1)['title'];
            document.open();
            document.write("<h1>" + bookTitle + "</h1>");
            document.close();
        })
    });
  };
