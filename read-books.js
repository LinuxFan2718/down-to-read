chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        if(request.url == "https://read.amazon.com/") {
          readBooks();
        } else {
          chrome.runtime.sendMessage({"message": "open_new_tab", "url": "https://read.amazon.com"});
        }
      }
    }
  );

  function readBooks() {
    // DOM is loaded
    var db = openDatabase('K4W', '3', 'down_to_read', 2 * 1024 * 1024);
    document.open();

    $(function(){
      // An object to store our images
      var imgs = {
        leather: new Image(),
        canvas: new Image()
      };
      // An object to store our canvases
      var canvases = {};
      // Counts how many images are loaded.
      var imgsLoaded = 0;
      // Loop over each of the imgs and insert it into the hidden container.
      $.each(imgs, function(index, img){
        $('#hidden-container').append(img);
        // Once the image is loaded we create a canvas the exact size of our images
        img.onload = function() {
          canvases[index] = $("<canvas />");
          canvases[index]
            .attr('width', img.clientWidth)   // Set the height of the canvas to the img height
            .attr('height', img.clientHeight) // same with width.
            .attr('id', index)                // Give it an id according to our texture
            .addClass('texture');             // And a class of 'texture'
          $('body').append(canvases[index]);    // Append it to our document body
          // We then draw the image on our canvas
          canvases[index].get(0).getContext('2d').drawImage(img, 0, 0);
          imgsLoaded++;
          if(imgsLoaded === Object.keys(imgs).length){
            // Do something
          }
        }
      });
      // And here we set the src attribute of each image
      // chrome.runtime.getURL('wood.png');
      imgs.leather.src = chrome.runtime.getURL('leather.png');
      imgs.canvas.src = chrome.runtime.getURL('canvas.png');
    });

    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM bookdata;', [], function(tx, results) {
        document.write('<div id="hidden-container"></div>');
        document.write('<div id="bookcase-cont">');
        document.write('<div id="bookcase">');

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
        document.write('</div></div>');

        var head = document.head;

        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = chrome.runtime.getURL('style.css');
        head.appendChild(link);

        // var img = document.createElement("img");
        // img.src = chrome.runtime.getURL('wood.png');
        // document.body.appendChild(img);
      })
    });

    document.close();
  };
