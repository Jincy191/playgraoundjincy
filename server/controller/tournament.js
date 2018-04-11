//var argv=require('yargs').argv;
var mysql = require('mysql');
function get_connection() {
    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'test'
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
    return con;
}

function deletePlayer(cb) {
    var con = get_connection();
    var sql = "truncate player";
    con.query(sql, function (err, result) {
        con.end();
        if (err) {
            cb(err, 0);
        }
        cb(null, result.affectedRows);
    })
}

function deleteMatches(cb) {
    var con = get_connection();
    var sql = "truncate matches";
    con.query(sql, function (err, result) {
        con.end();
        if (err) {
            cb(err, 0);
        }
        cb(null, result.affectedRows);
    })
}






// var count = 0;
function registerPlayers(players, cb) {
    var con = get_connection();
    con.query('INSERT INTO player SET ?', players, function (error, results) {
        con.end();
        if (error) {
            cb(error, 0);
        }
        var pairedStatus;
        isPaired(players, function (err, result) {
            pairedStatus = result;
            console.log("PairedStatus in isPaired function = " + pairedStatus);
            var data = Math.log2(pairedStatus) % 1;
            console.log(data)
            if (data == 0) {
                console.log("you can conduct a round or add more players");
                pairedStatus = 0;
            }
            else {
                console.log("total players should be 2^n where n is total no. of players");
                pairedStatus = 1;
            }
            cb(null, results, pairedStatus);
        })
        /*res.set('Content-Type', 'application/javascript');
        res.render('inside_game', { myVar : completed });*/
        // <script>alert("you can conduct a round or add more players");</script>
    });
}

function displayTours(cb) {
    var con = get_connection();
    //var con=get_connection();
    var sql = "select tour_name  from tournament;"
    con.query(sql, function (err, result) {
        con.end();
        if (err) {
            cb(err, 0);
        }
        cb(null, result);
    })
}


// select tour_id, count(tour_id) as total_players from player where tour_id = 1 group by tour_id;

function isPaired(player_id, cb) {
    var con = get_connection();
    var sql = "select tour_id, count(player_id) as count from player where tour_id = ?";
    con.query(sql, player_id.tour_id, function (err, result) {
        con.end();
        if (err) {
            throw err
            return cb(err, 0);
        }
        console.log("Count value for given tour_id in isPaired = " + result[0].count);
        cb(null, result[0].count);
    })
}

function countPlayers(cb) {
    var con = get_connection();
    var sql = "select player_id, count(*) as total_players from player;"
    con.query(sql, function (err, result) {
        con.end();
        if (err) {
            cb(err, 0);
        }
        cb(null, result[0].total_players);
    })
}
// var c_round=Math.log2(argv.n);
// c_round++;
// var reportMatch=function(round){
//     if(round===c_round){
//         playerStandings();
//         return;
//     }
//     var query="select player_id from player order by points desc;"
//         con.query(query,function(err,result){
//             if(err) throw err;
//         swissPairings(result,round,reportMatch);
//     });
// }
function matchUpdate(first_player, second_player, round) {
    var con = get_connection();
    var rd = Math.random();
    if (rd > 0.5) {
        winner_id = first_player;
        loser_id = second_player;
    }
    else {
        loser_id = first_player;
        winner_id = second_player;
    }
    var sql = "insert into matches(winner_id,loser_id,round) values(?,?,?)";
    con.query(sql, [winner_id, loser_id, round], function (err, result) {
        con.end();
        if (err) throw err;
        //console.log(result);
    });
}
function swissPairings(standings, matches, round) {
    var pairing = [];
    while (standings.length > 0) {
        var first = standings.splice(0, 1);
        var first_player = first[0].player_id;
        for (var i = 0; i < standings.length; i++) {
            var second_player = standings[i].player_id;
            if (!((matches.winner_id == first_player && matches.loser_id == second_player) || (matches.winner_id == second_player && matches.loser_id == first_player))) {
                pairing.push([first_player, second_player]);
                standings.splice(i, 1);
                matchUpdate(first_player, second_player, round);
                break;
            }
        }
    }
    console.log(pairing);
}

// var query="select player_id,name from player order by points desc;"
//     con.query(query,function(err,result){
//         con.end();
//         if(err){
//             cb(err,0);
//         }
//     var length=result.length;
//     var pairing=[];
//     console.log(result);
//     for(var i=0;i<length;i+=2){
//         pairing.push(result[i].player_id,result[i].name,result[i+1].player_id,result[i+1].name);
//     }
//     cb(null,pairing);
// });
//console.log(standings, matches, 'swissPairings')
//}

// var upd="update player set points=points+1 where(player_id="+winner+");";
// (function (round,winner,loser) {
//     con.query(upd,function(err,result){
//         if(err) throw err;
//         var ins="insert into matches(match_id,round,winner,loser) values('match_id','"+round+"','"+winner+"','"+loser+"');"
//             con.query(ins,function(err,result){
//                 if(err) throw err;
//     //console.log(result);
//     });
//     })
// })(round, winner,loser)

//console.log(round,winner,loser);

//         if(i>length/2){
//             cb=reportMatch(++round);
//         }

//     }
// }
// reportMatch(1);



function playerStandings(round) {
    var con = get_connection();
    var sql = "select player.player_id, player.name, count(matches.winner_id) as points from player left join matches on matches.winner_id = player.player_id group by player.player_id order by points desc;"
    con.query(sql, function (err, result) {
        if (err) throw err;
        var standings = result;
        var sql = "select winner_id, loser_id from matches;"
        con.query(sql, function (err, result) {
            if (err) throw err;
            var matches = result; res.sendFile(path.join(__dirname + '/views/tour.html'));

            swissPairings(standings, matches, round)
            con.end();
        })
    });
}
function finalResult(cb) {
    var con = get_connection();
    var query = `
        select p.player_id, p.name, ifnull(ws.wins, 0) as wins,
               (ifnull(ws.wins,0) + ifnull(ls.losses,0)) as matches_played
        from
            player p
            left outer join
            ((select winner_id, count(*) as wins from matches group by winner_id) as ws)
                on (p.player_id = ws.winner_id)
            left outer join
            ((select loser_id, count(*) as losses from matches group by loser_id) as ls)
                on (p.player_id = ls.loser_id)
        order by
        wins desc;`
    con.query(query, function (error, results, fields) {
        con.end();
        if (error) {
            cb(error, 0);
        }
        var out = [];
        for (var result of results) {
            out.push({
                id: result.player_id,
                name: result.name,
                wins: result.wins,
                matches: result.matches_played
            })
        }
        cb(null, out);
    });
}
module.exports = {
    registerPlayers: registerPlayers,
    deletePlayer: deletePlayer,
    countPlayers: countPlayers,
    deleteMatches: deleteMatches,
    playerStandings: playerStandings,
    finalResult: finalResult,
    displayTours: displayTours
}




