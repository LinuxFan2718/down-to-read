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
        var style = document.createElement("style");
        head.appendChild(style);
        style.type = 'text/css';
        var css = '#bookshelf { background: green; }\
                   #book { background: blue; }'
        style.appendChild(document.createTextNode(css));
        var img = document.createElement("img");
        img.src = chrome.runtime.getURL('wood.png');
        document.body.appendChild(img);
      })
    });
 


    document.close();
  };
