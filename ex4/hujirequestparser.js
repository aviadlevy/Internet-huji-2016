/**
 * Created by aviadle on 15/12/21.
 */

var querystring = require("querystring");
var httpReq = require('./httpReq.js');

exports.parser = function (string) {
    var request, lines, firstLine, line, header, firstKey, secondKey;
    request = new httpReq.HttpReq();
    lines = string.split("\r\n");
    firstLine = lines[0];
    header = ""; // last found header
    firstKey = secondKey = "";

    request.path = firstLine.substring(firstLine.indexOf(' ') + 1, firstLine.lastIndexOf(' ')).split("?")[0];
    request.protocol = firstLine.substring(firstLine.lastIndexOf(' ') + 1, firstLine.lastIndexOf('/')).toLowerCase();
    request.version = firstLine.substring(firstLine.lastIndexOf('/') + 1);

    for (var i = 1; i < lines.length; i++) {
        if ((i !== 1) && (/^\s/).test(lines[i].charAt(0))) {
            request.headers[header] += lines[i];
        }
        else {
            header = lines[i].split(":")[0].trim().toLowerCase();
            request.headers[header] = lines[i].split(":").slice(1).join(":").trim();
        }
    }

    request.query = querystring.parse(firstLine.substring(firstLine.indexOf(' ') + 1, firstLine.lastIndexOf(' ')).split("?")[1]);
    for (var curr in request.query) {
        if (curr.indexOf("[") > -1) {
            if (request.query[curr.substring(0, curr.indexOf("["))] === undefined) {
                request.query[curr.substring(0, curr.indexOf("["))] = {}
            }
            firstKey = curr.substring(0, curr.indexOf("["));
            secondKey = curr.substring(curr.indexOf("[") + 1, curr.indexOf("]"));
            request.query[firstKey][secondKey] = request.query[curr];
            request.query[curr].delete;
        }
    }
    request.method = firstLine.substring(0, firstLine.indexOf(' '));

    request.cookies = querystring.parse(request.headers["cookie"], ";");

    for (var cookie in request.cookies) { // trim spaces
        request.cookies[cookie.trim()] = request.cookies[cookie].trim();
        if (cookie !== cookie.trim()) { // remove duplicates
            delete request.cookies[cookie];
        }
    }


    request.host = request.headers.host;
    return request;
};

exports.stringify = function(response) {
    var resStr; // the response string
    var statusLine = response.socket.req.protocol.toUpperCase() + "/" + response.socket.req.version + " " + response.statusCode + " " + response.statusReason + "\r\n";
    var headerLines = "";

    for (var key in response.headers) {
        headerLines += key.replace(/\b[a-z]/g, function (c) { // make all first letters capital
                return c.toUpperCase()
            }) + ": " + response.headers[key] + "\r\n";
    }
    resStr = statusLine + headerLines + "\r\n";
    if (response.body) {
        resStr += response.body;
        if(response.headers['content-length'] == 0) // when no content in,
                                                    // then we response with 404
                                                    // (so let's enter the right length)
        {
            resStr = resStr.replace("Content-Length: 0", "Content-Length: " + response.body.length)
        }
    }
    else if (response.statusCode != 200)
    {
        resStr += response.statusReason;
    }
    return resStr; // remove 'header: ' from beginning
}
