$.get('../transactions/bittrex.csv', function(data) {
    var result = []
    var lines = data.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(",");
        console.log(line);
        result.push(line);
    }
    return result;
});



