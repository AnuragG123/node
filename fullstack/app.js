var express = require('express');
var app = express();
var port = process.env.PORT || 8900;

var restaurantsRouter = require('./src/routes/restaurantRouter')
var cityRouter = require('./src/routes/cityRouter');
var cors = require('cors');
app.use(cors())

//Static File Path
app.use(express.static(__dirname+'/public'))
//HTML
app.set('views', './src/views')
//View Engine
app.set('view engine', 'ejs')


//Routes
app.get('/',function(req,res){
    //res.status(200).send("<h1> Welcome to NodeJs</h1>")
    res.render('index')
});

app.use('/restaurants', restaurantsRouter);
app.use('/city',cityRouter);

app.listen(port, function(err){
    if(err) throw err;
    console.log(`Server listing to port ${port}`)
});

