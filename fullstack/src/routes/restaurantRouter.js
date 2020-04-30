var express = require('express');
var restaurantsRouter = express.Router()
var mongodb = require('mongodb').MongoClient;
var url="mongodb://127.0.0.1:27017";

function router(menu){

    restaurantsRouter.route('/')
        .get( function(req,res){
        mongodb.connect(url,function(err,dc){
            if(err){
                res.status(501).send("Error While Connecting")
            }else{
                const dbo = dc.db('nareshit');
                dbo.collection('zomato').find({}).toArray((err,data) => {
                    if(err){
                        res.status(501).send("Error While Feetching")
                    }else{
                        res.render('restaurants',{title:'Restaurants List', restaurants:data,menu:menu})
                    }
                })
            }
        })
        
    })

    restaurantsRouter.route('/details')
        .get( function(req,res){
        res.status(200).send("restaurants  details")
    })

    return restaurantsRouter;

}

module.exports = router;