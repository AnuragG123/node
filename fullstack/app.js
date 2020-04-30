var express = require('express');
var app = express();
var port = process.env.PORT || 8900;

var menu = [
    {link:'/',name:'Home'},
    {link:'/restaurants',name:'Restaurants'},
    {link:'/city',name:'City'}
]

var restaurantsRouter = require('./src/routes/restaurantRouter')(menu)
var cityRouter = require('./src/routes/cityRouter')(menu);
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
    res.render('index',{title:'Home',menu:menu})
});

app.use('/restaurants', restaurantsRouter);
app.use('/city',cityRouter);

app.listen(port, function(err){
    if(err) throw err;
    console.log(`Server listing to port ${port}`)
});

