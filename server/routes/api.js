var express = require('express');
var player = require('../controller/tournament');
var user = require('../controller/user');
var bodyParser = require('body-parser');
var parse = bodyParser.urlencoded({ extended: true });
var router = express.Router();
var app = express();
var path = require('path');




module.exports = function () {

  router.get('/', function (req, res) {
    app.use(express.static(path.join(__dirname, '/index.html')));
    res.json({ message: 'welcome to Swiss Tournament' });
  });
  router.post('/registerPlayers', parse, function (req, res) {
    console.log("inside api/registerPlayer")
    var players = req.body;
    /*<<<<<<<<<<<<<<<<<<<Register Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    player.registerPlayers(players, function (err, result, pairedstatus) {
      console.log("---------------------------------------" + pairedstatus);
      if (err) {
        console.log("error ocurred", err);
        res.send({
          "code": 400,
          "failed": "error ocurred"
        })
      } else {
        if (pairedstatus == 0) {
          res.json({
            "code": 200,
            "success": "Team is full",
            "result" : result
          })
        }
        else
          res.redirect('/inside_game');
        // res.render('/inside_game');
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"

        });*/
      }
    });
  });

  /*<<<<<<<<<<<<<<<<<<<Register Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/sub_tour_count', function (req, res) {
    player.displayTours(function (error, results) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          "code": 400,
          "failed": "error ocurred"
        })
      } else {
        console.log('Tournament Created ', results);

        res.render('create_tour', { tour: results });
        // res.send({
        //   "code":200,
        //   "success":"user registered sucessfully"
        //});
      }
    });
  });

  /*<<<<<<<<<<<<<<<<<<<LOGIN USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/loginUser', function (req, res) {
    console.log("hi")
    user.loginUser(req.body.email, req.body.password, function (err, result) {
      console.log("hi1")
      if (err) {
        res.send({
          "code": 400,
          "failed": err
        })
      } else {
        console.log('The solution is: ', result);
        /*res.send({
          "code":200,
          "success":"user successfully login"


        });*/
        res.redirect('/create_tour');
      }
    });
  });

  /*<<<<<<<<<<<<<<<<<<<LOGIN USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


  router.post('/registerUser', parse, function (req, res) {
    var users = req.body;
    /*var users={
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "email":req.body.email,
    "password":req.body.password,
    }*/
    console.log(users)
    user.registerUser(users, function (err, result) {
      console.log("hi1")
      if (err) {
        console.log("error ocurred", err);
        res.send({
          "code": 400,
          "failed": "error ocurred"
        })
      } else {
        console.log('The solution is: ', result);
        res.redirect('/login');
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"
        });*/
      }
    });
  });
  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /*<<<<<<<<<<<<<<<<<<<Sub Tournament>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/subtournament', function (req, res) {
    user.subTournament(req.body.tour_name, function (error, results) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          "code": 400,
          "failed": "error ocurred"
        })
      } else {
        console.log('Tournament Created ', results);

        res.redirect('/inside_game'); fffaqqqw
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"
        });*/
      }
    });
  });





  return router;
}






// router.post('/login',user.login)
// router.post('/tournament',login.subtournament)
// router.post('/registerPlayers',login.registerPlayers)
