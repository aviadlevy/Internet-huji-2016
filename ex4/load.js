http = require('http');
var hws = require('./hujiwebserver.js');

var PORT = 8083;
var testNum = 500;
var responseCounter;

var runMultiple = function () {
    var options = {
        hostname: 'localhost',
        port: PORT,
        path: '/ex2/index.html',//index.html  inside the root folder
        method: 'GET'
    };

    var i;
    responseCounter = 0;
    for (i = 0; i < testNum; i++) {
        //console.log(i);
        var req = http.get(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk, i) {
                //print the body of the request, can compare to body to the original desire body.
                console.log('Request is: ' + chunk);
            });
            res.on('end', function () {
                responseCounter += 1;
                console.log("response counter: ", responseCounter);
            });
            res.on('error', function (e) {
                console.log("error in load!!!!! ", e);
            })

        })
    }
}

hws.start(PORT, function (e, serverObj) {
    if (e) {
        (console.log(e))
    }
    else {
        (console.log('server is up. port ' + PORT));
        serverObj.use(hws.static("www"));
    }
    setTimeout(function () {
        serverObj.stop(function () {
            console.log("\n================");
            if (responseCounter == testNum) {
                console.log("finished loading " + testNum + " times" +
                    " SUCCESSFULLY!");
            }
            else {
                console.log("FAILED!");
            }
            console.log("server closed");
            console.log("================");
        })
    }, 3000);
    runMultiple();
});
