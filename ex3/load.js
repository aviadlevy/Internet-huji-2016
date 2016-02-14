/**
 * Created by aviadle on 12/26/2015.
 */
var rootFolder = "ex2Test";

var port = 8002;

var options = {
    hostname: 'localhost',
    port: port,
    method: 'GET',
    path: "/index.html"
};

var hujiwebserver = require('./hujiwebserver.js');
var server = hujiwebserver.start(port, rootFolder, function (e) {
    e ? (console.log(e)) : (console.log('server is up!'));

    http = require('http');

    var i, responseCounter = 0;
    for (i = 0; i < 600; i++) {
        http.get(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (data) {
                console.log(data.substring(0,15));
            });
            res.on('end', function () {
                responseCounter += 1;
                console.log("response counter: ", responseCounter);
            });
            res.on('error', console.log);
        })
    }
});
setTimeout(function () {
    server.stop(function () {
        console.log("close server");
    });
}, 10000);