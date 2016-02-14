/**
 * Created by aviadle on 15/12/18.
 */

var parser = require("./hujirequestparser.js");
var httpRes = require("./httpRes.js");
var net = require("net");
var fs = require("fs");
var path = require("path");
var querystring = require("querystring");

function isComplete(data) {
    if (!Buffer.isBuffer(data)) {
        data = new Buffer(data, "utf-8");
    }
    for (var i = 0; i < data.length - 1; i++) {
        // windows
        if (data[i] === 13) {  // ascii value of CR
            if (data[i + 1] === 10) {  // ascii value of LF
                if (i + 3 < data.length && data[i + 2] === 13 && data[i + 3] === 10) {
                    // finished the headers
                    return {loc: i, after: i + 4};
                }
            }
        }
        // linux
        else if (data[i] === 10) {  // only '\n' as separate between lines
            if (data[i + 1] === 10) {
                return {loc: i, after: i + 2};
            }
        }
    }
    // not finished!
    return {loc: -1, after: -1};
}
function getPath(resource, path) {
    if (resource[0] === "/") {
        resource = resource.substring(1);
    }
    if (path[0] === "/") {
        path = path.substring(1);
    }

    var params = {};
    var resourceArr = resource.split("/");
    var pathArr = path.split("/");
    var length = Math.min(resourceArr.length, pathArr.length);

    for (var i = 0; i < length; i++) {
        if (resourceArr[i][0] === ':') {
            params[resourceArr[i].substring(1)] = pathArr[i];
        }
    }
    return params;
}
function getNextHandler(handlers, req, beginIndex) {
    for (; beginIndex < handlers.length; beginIndex++) {
        var varReg = new RegExp(':[^/]+', 'g');
        var newReg = handlers[beginIndex].resource.replace(varReg, '[^/]+');
        if (handlers[beginIndex].resource.lastIndexOf('/') === handlers[beginIndex].resource.length - 1) {
            newReg += "([^/]+(/[^/]+)*)?";
        }
        else {
            newReg += "(/[^/]+)*";
        }
        newReg = "^(" + newReg + ")$";
        var testResource = new RegExp(newReg);
        if ((handlers[beginIndex].method === 'ALL' || handlers[beginIndex].method.toLowerCase() ===
            req.method.toLowerCase()) && testResource.test(req.path)) {
            return handlers[beginIndex];
        }
    }
    return null;
}
function runNextHandler(req, res, handlers, beginIndex) {
    var nextHandler = getNextHandler(handlers, req, beginIndex);
    if (nextHandler === null) {
        return;
    }
    req.params = getPath(nextHandler.resource, req.path);
    nextHandler.handler(req, res, function next() {
        runNextHandler(req, res, handlers, beginIndex + 1);
    });
}

// resest socket timeout
function resetTimeout(socket, x) {
    clearTimeout(socket.timeoutH);
    socket.timeoutH = setTimeout(function () {
        socket.end();
    }, x);
}

exports.createServer = function (port, handlers) {
    var server;
    server = net.createServer(function (socket) {
        socket.setEncoding('utf8');
        socket.timeoutH = 0;
        resetTimeout(socket, 2000);
        socket.reqStr = "";
        socket.req = {};
        socket.isComplete = false;
        socket.id = Math.round(Math.random() * 5000);
        socket.on("data", function (data) {
            try {
                resetTimeout(socket, 2000);
                socket.reqStr += data;
                socket.endIndex = isComplete(socket.reqStr);
                if (!socket.isComplete && socket.endIndex.loc !== -1) {
                    socket.isComplete = true;
                    socket.req = parser.parser(socket.reqStr.substring(0, socket.endIndex.loc));
                    socket.res = new httpRes.HttpRes(socket);
                    if ("content-length" in socket.req.headers && parseInt(socket.req.headers["content-length"]) > 0) {
                        socket.req.body = socket.reqStr.substring(socket.endIndex.after);
                    }
                    socket.res.isEnd = !!((parseFloat(socket.req.version) !== 1.1
                    && socket.req.get("Connection").toLowerCase() !== "keep-alive")
                    || socket.req.get("Connection").toLowerCase() === "close");
                }
                else if (socket.isComplete) {
                    socket.req.body += data;
                }
                if (socket.isComplete && (( socket.req.get("content-length") === undefined) ||
                    (parseInt(socket.req.get("content-length")) <= socket.req.body.length))) {

                    socket.reqStr = "";
                    socket.isComplete = false;
                    socket.req.bodyParams = {};
                    if (socket.req.method === "POST" && socket.req.get("Content-Type") === "application/x-www-form-urlencoded") {
                        socket.req.bodyParams = querystring.parse(socket.req.body);
                        for (var key in socket.req.bodyParams) {
                            var valIdx = key.trim().replace(new RegExp('\\+', 'g'), ' ');
                            socket.req.bodyParams[valIdx] = socket.req.bodyParams[key].trim().replace(new RegExp('\\+', 'g'), ' ');
                            if (key !== key.trim()) {
                                delete socket.req.bodyParams[key];
                            }
                        }
                    }
                    runNextHandler(socket.req, socket.res, handlers, 0);
                    if (!socket.res.doneHeaders) {
                        socket.res.status(404).send(socket.res.statusReason);
                    }
                }
            } catch (e) {
                console.log(e);
                socket.res.status(500).send(socket.res.statusReason);
                socket.end();
            }
        });
        socket.on('end', function (data) {
            console.log("socket closed");
        });
        socket.on('error', function (err) {
            console.log('socket error!');
            socket.end();
        });
    });
    server.once('error', function (err) {
        if (err.code === 'EADDRINUSE' || err.code === 'ECONNREFUSED') {
            console.log("Error with the server:\n" + err);
        }
        console.log(err);
        throw "error in server";
    });
    server.listen(port, 'localhost');
    return server;
};