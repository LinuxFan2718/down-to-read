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

    // step 3
    function makeBook (options) {
      // We need a texture to apply to the book.
      if(typeof options.texture === "undefined") return false;
      // Our default options
      options = $.extend(true,
        {
          text: "",
          color: "#B8293B",
          height: 200,
          width: 32
        }, options);
      // This gets our container height
      var contHeight = $('#bookcase').height();
      // Here we create our text and book elements.
      var $text = $('<span class="booktext">' + options.text + '</span>');
      var $book = $('<div class="book" />');
      // And we set the book properties as set in options.
      $book.height(options.height);
      $book.width(options.width);
      // Here we use jQuery $.offset() to position our book resting on the 'shelf'
      $book.offset({top: contHeight - options.height});
      // Now we create our book texture
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      // We set the properties of our canvas according to our options
      canvas.className = 'canvas-texture';
      canvas.width = options.width;
      canvas.height = options.height;
      context.fillStyle = options.color;
      // And then we append it to our book
      $book.append(canvas);
      // Fill with a basic colour
      context.fillRect(0, 0, options.width, options.height);
      // Overlay our texture onto the book.
      //options.texture.get(0).getContext('2d').blendOnto(context,'overlay');
      // Add our text to the book.
      $book.append($text);
      // Return our book (note this is a jQuery object!)
      return $book;
    }

    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM bookdata;', [], function(tx, results) {
        document.write('<div id="hidden-container"></div>');        
        document.write('<div id="bookcase-cont">');
        document.write('<div id="bookcase">');
        // step 2
        $(function(){
          // An object to store our images
          var imgs = {
            leather: new Image(),
            canvas: new Image()
          };
          // And here we set the src attribute of each image
          imgs.leather.src = chrome.runtime.getURL('leather.png');
          imgs.canvas.src = chrome.runtime.getURL('canvas.png');
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
                for (let i=0; i < results.rows.length; i++) {
                  var serializedAuthors = eval(results.rows.item(i)['authors']);
                  var authors = '';
                  for (let j=0; j < serializedAuthors.length; j++) {
                    var swappedAuthor = serializedAuthors[j].split(',');
                    authors += swappedAuthor[1] + ' ' + swappedAuthor[0] + ', ';
                  }
                  authors = authors.substring(0, authors.length - 2);
                  spineText = results.rows.item(i)['title'] + " by " + authors;
                  var $book = makeBook({text: spineText, texture: canvases['leather']});
                  $('#bookcase').append($book);
                }

              }
            }
          });
        });
        document.write('</div></div>');
      })
    });

    document.close();
  };
