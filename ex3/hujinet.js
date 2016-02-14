/**
 * Created by aviadle on 15/12/18.
 */

var parser = require("./hujirequestparser");
var net = require("net");
var fs = require("fs");
var path = require("path");

var isComplete = function (str) {
    var body, length, bodyLength;
    if (str.indexOf("\r\n\r\n") > -1) {
        body = str.substring(str.indexOf("\r\n\r\n"), str.length);
        if (str.indexOf("Content-Length") > -1) {
            length = str.substring(str.indexOf("Content-Length"), str.length);
            bodyLength = length.substring(0, length.indexOf(" "));
            return (body.length === bodyLength);
        }
        return true;
    }
    return false;
};

var typeDic = {
    '.js': 'application/javascript',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.png': 'image/png'
};

var request = function (socket, rootFolder, req) {
    var res, isError, stream, headersToString, responseToString, statusLine;
    res = {};
    res.headers = {};
    res.ver = req.ver;
    isError = false;
    fs.stat(rootFolder + req.path, function (e, stat) {
        if (req.path.indexOf("..") > -1) {
            isError = true;
            res.reason = "Forbidden";
            res.code = "403";
            //res.path = rootFolder + "\\errors\\403.html";
        }
        else if (e || req == null || req.path === '/') {
            isError = true;
            res.reason = "Not Found";
            res.code = "404";
            //res.path = rootFolder + "\\errors\\404.html";
        }
        else if (req.reqMethod != "GET") {
            isError = true;
            res.reason = "Method Not Allowed";
            res.code = "405";
            //res.path = rootFolder + "\\errors\\405.html";
        }
        else if (["1.1", "1.0"].indexOf(req.ver) == -1 || !req.isPersistent) {
            isError = true;
            res.reason = "Internal server error";
            res.code = "500";
            //res.path = rootFolder + "\\errors\\500.html";
        }
        else {
            res.reason = "OK";
            res.code = "200";
            res.path = rootFolder + req.path;
            res.headers["Content-Length"] = stat.size;
            res.headers["Content-Type"] = typeDic[path.extname(req.path)];
        }
        if (!isError) {
            stream = fs.createReadStream(res.path);
            stream.on('open', function () {
                socket.write(createResponse(res));
                stream.pipe(socket, {end: false});

            });
        } else {
            res.headers["Content-Length"] = ("<h1>" + res.code + "</h1>\n<h2>" + res.reason + "</h2>").length;
            res.headers["Content-Type"] = typeDic[".html"];
            socket.write(createResponse(res) + "<h1>" + res.code + "</h1>\n<h2>" + res.reason + "</h2>");
        }
        if (!req.isPersistent) {
            socket.end();
        }
    });
};

var createResponse = function (res) {
    var headersToString, responseToString, statusLine;
    headersToString = "";
    statusLine = "" + "HTTP/" + (res.ver + " " + res.code + " " +
        res.reason);
    for (var key in res.headers) {
        headersToString += (key + " : " + res.headers[key] + "\n");
    }
    responseToString = statusLine + "\n" + "Date: " + Date() + "\n" +
        headersToString + "\n";
    return responseToString;
};

exports.initServer = function (port, rootFolder) {
    var dataToString, server;
    try {
        fs.lstatSync(rootFolder); //check if root folder exists
    } catch (e) {
        throw "Can't find root folder";
    }
    dataToString = "";
    server = net.createServer(function (socket) {
        socket.setEncoding('utf8');
        socket.on("data", function (data) {
            dataToString += data;
            if (isComplete(dataToString)) {
                try {
                    request(socket, rootFolder, parser.parser(dataToString));
                } catch (e) {
                    console.log(e);
                }
                dataToString = "";
            }
        });
        socket.on('end', function (data) {
            console.log("socket closed");
        });
        socket.on('error', function (err) {
            console.log('socket error!');
            socket.end();
        });
        socket.setTimeout(2000, function () {
            console.log('socket timeout');
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