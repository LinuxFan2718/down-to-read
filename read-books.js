// Web SQL
// can be viewed in Chrome Dev Tools, Application tab

var db = openDatabase('K4W', '3', 'down_to_read', 2 * 1024 * 1024);
db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM bookdata;', [], function(tx, results) { 
        console.log(results.rows.item(1));
    })
});
