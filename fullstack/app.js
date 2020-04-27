var express = require('express');
var app = express();
var port = process.env.PORT || 8900;

//Routes
app.get('/',function(req,res){
    res.status(200).send("<h1> Welcome to NodeJs</h1>")
});

app.get('/restaurants', function(req,res){
    res.status(200).send("<h1> Welcome to Restaurants</h1>")
})

app.get('/city',function(req,res){
    res.status(200).send("<h1> Welcome to City</h1>")
})

app.listen(port, function(err){
    if(err) throw err;
    console.log(`Server listing to port ${port}`)
});

