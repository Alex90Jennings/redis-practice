const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

const port = 4000;
const app = express();
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

const client = redis.createClient();
client.on('connect', function(){
    console.log(`connected to Redis`)
})

app.get('/', function(req, res, next){
    res.render('searchUsers');
})
app.post('/users/search', function(req, res, next){
    const id = req.body.id

    client.hgetall(id, function(err, obj){
        if(!obj){
            res.render('searchUsers', {
                error: `user does not exist`
            })
        } else {
            obj.id = id
            res.render('details', {
                user: obj
            })
        }
    });
})

app.listen(port, function(){
    console.log(`Server started on port ${port}`);
})