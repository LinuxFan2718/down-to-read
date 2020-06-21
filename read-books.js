chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        console.log(request.url);
        // if on read.amazon.com
        if(request.url == "https://read.amazon.com/") {
          readBooks();
        } else {
          alert("please go to read.amazon.com and try again");
          //chrome.runtime.sendMessage({"message": "open_new_tab", "url": "https://read.amazon.com"});
          //wait for it to load
        }
      }
    }
  );

  function readBooks() {
    // DOM is loaded
    var db = openDatabase('K4W', '3', 'down_to_read', 2 * 1024 * 1024);
    document.open();

    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM bookdata;', [], function(tx, results) {

        document.write('<div id="bookshelf">');
        for (let i=0; i < results.rows.length; i++) {
          var serializedAuthors = eval(results.rows.item(i)['authors']);
          var authors = '';
          for (let j=0; j < serializedAuthors.length; j++) {
            var swappedAuthor = serializedAuthors[j].split(',');
            authors += swappedAuthor[1] + ' ' + swappedAuthor[0] + ', ';
          }
          authors = authors.substring(0, authors.length - 2);
          document.write('<div id="book">');
          document.write("<p>" + results.rows.item(i)['title'] + " by " + authors + "</p>");
          document.write("</div>");
        }
        document.write('</div>');

        var head = document.head;

        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = chrome.runtime.getURL('style.css');
        head.appendChild(link);

        var img = document.createElement("img");
        img.src = chrome.runtime.getURL('wood.png');
        document.body.appendChild(img);
      })
    });

    document.close();
  };
