var fs = require('fs');

/*fs.writeFile('test.txt','This is from NodeJs FS', function(err){
    if(err) throw err;
    console.log('FileCreated')
})



fs.appendFile('test.txt',`This is from NodeJs FS ${Math.random()} \n`, function(err){
    if(err) throw err;
    console.log('FileCreated')
})

fs.readFile('test.txt','utf-8',function(err,data){
    if(err) throw err;
    console.log(data)
})


fs.rename('test.txt','test1.txt',function(err){
    if(err) throw err;
    console.log('File Rename')
})

fs.unlink('test1.txt',function(err){
    if(err) throw err;
    console.log('File Deleted')
})*/

fs.appendFile('test.txt',`This is from NodeJs FS ${Math.random()} \n`, function(err){
    if(err) throw err;
    fs.readFile('test.txt','utf-8',function(err,data){
        if(err) throw err;
        console.log(data)
    })
})