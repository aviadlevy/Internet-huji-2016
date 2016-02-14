/**
 * Created by aviadle on 1/18/2016.
 */

var rootFolder = "www";
var fs = require('fs');
var http = require('http');

var port = 8001;

var hujiServer = require('./hujiwebserver');
var server = hujiServer.start(port, function (e, server) {
    if (e) {
        console.log(e);
        this.stop();
    } else {
        console.log("server is up!");
        server.use(hujiServer.static("www"));
    }
});

var pathsToCheck = ["/ex2/index.html", "/ex2/style.css", "/ex2/main.js", "/ex2/minions.jpg",
    "/ex2/minions2.png", "/ex2/notFound.html", "/../../goToRoot.html"];
var i = 0;
var test = [];


var options = {
    path: pathsToCheck[i],
    port: port.toString()
};

var callback = function (response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        compareOutput(str);
    })


};

http.request(options, callback).end();

function compareOutput(httpData) {
    var originalData;
    if (i < 5) {    // test my files
        fs.readFile(rootFolder + pathsToCheck[i], function (err, data) {
            if (data) {
                originalData = data.toString();
                //console.log("orig ", originalData) // print the original data
            }
            //check if the original data is same to data that received
            test[i] = ((originalData === httpData) === fs.existsSync(rootFolder + pathsToCheck[i]));
            if (test[i]) {
                console.log(pathsToCheck[i] + " is OK\n");
                console.log("first 7 chars:\nfrom file:\n" +
                    originalData.slice(0, 7) + "\n-\nfrom http:\n" +
                    httpData.slice(0, 7) + "\n-----");
            } else {
                console.log(pathsToCheck[i] + " is not OK");
            }
            i++;
            options = {
                path: pathsToCheck[i],
                port: port.toString()
            };
            http.request(options, callback).end();
        });
    } else if (i == 5) {   // test path not found
        if (httpData.indexOf('The requested resource not found') > -1) {
            console.log("'404' is OK");
            test[i] = true;
        }
        else {
            console.log("'404' test is not OK");
            test[i] = false;
        }
        console.log("-------");
        i++;
        options = {
            path: pathsToCheck[i],
            port: port.toString()
        };
        http.request(options, callback).end();
    } else if(i==6){  //  test trying to reach files upper than root
        if (httpData.indexOf('Forbidden') > -1) {
            console.log("'403' is OK");
            test[i] = true;
        }
        else {
            console.log("'403' test is not OK");
            test[i] = false;
        }
        console.log("-------");
        i++;
        compareOutput();
    }
    else {  // finished test. see result
        server.stop(function () {
            console.log("-------\nfinish-test, the test is:");
            console.log((test[0] && test[1] && test [2] && test[3] &&
            test[4] && test[5] && test[6])
                ? "OK" : "FAILED");
            console.log("server shutdown");
        });
    }
}
