var express= require('express');
const http = require('http');
const reload = require('reload');
var app = express();

app.set('view engine','pug');
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render('index');
});


const server = http.createServer(app);
server.listen(3000,function(){
    console.log('App running on port 3000!')
})
reload(app);