var http = require('http');

var server = http.createServer(function(req,res){
    res.write('This is node server');
    res.end()
})

server.listen(3400);