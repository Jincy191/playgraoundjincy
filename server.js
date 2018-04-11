var express = require('express');
var player = require('./server/controller/tournament');
var user = require('./server/controller/user');
var bodyParser = require('body-parser');
const api = require('./server/routes/api')();
var path = require('path');
var app = express();
var parse = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
});

//app.use(express.static(path.join(__dirname, './node501')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/tour.html'));
});
app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/register.html'));
});
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});
app.get('/create_tour', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/create_tour.html'));
});
app.get('/inside_game', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/inside_game.html'));
});


/*app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});*/

app.post('/contact', parse, function (req, res) {
    console.log(req.body);
    var user = req.body;
})


console.log(api);
/*var router = express.Router();

router.get('/',function(req,res){
    res.json({ message: 'welcome to Swiss Tournament' });
});*/

// router.post('/register',login.register);
// router.post('/login',login.login)
// router.post('/tournament',login.subtournament)
// router.post('/registerPlayers',login.registerPlayers)
app.use('/api', api);
app.listen(5000);
