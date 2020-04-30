var express = require('express');
var cityRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var url="mongodb://127.0.0.1:27017";


function router(menu){
	cityRouter.route('/')
		.get( function(req,res){
		//res.status(200).send(city)
		mongodb.connect(url,function(err,dc){
            if(err){
                res.status(501).send("Error While Connecting")
            }else{
                const dbo = dc.db('nareshit');
                dbo.collection('city').find({}).toArray((err,data) => {
                    if(err){
                        res.status(501).send("Error While Feetching")
                    }else{
                        res.render('city',{title:'City List',cities:data,menu:menu})
                    }
                })
            }
        })
		
	})

	cityRouter.route('/details')
		.get( function(req,res){
		res.status(200).send("City  details")
	});

	return cityRouter
}


module.exports = router;