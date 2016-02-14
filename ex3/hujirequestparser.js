/**
 * Created by aviadle on 15/12/21.
 */

exports.parser = function (string) {
    var request, lines, firstLine, line;
    request = {};
    request.headers = {};
    lines = string.split("\r\n");
    firstLine = lines[0].split(" ");
    request.reqMethod = firstLine[0];
    //if (["GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "OPTIONS", "CONNECT",
    //        "PATCH"].indexOf(request.reqMethod) == -1) {
    //    throw "Bad request method";
    //}
    request.path = firstLine[1];
    request.ver = (firstLine[2].split("/"))[1];
    //if (["1.1", "1.0"].indexOf(request.ver) == -1) {
    //    throw "Bad http version";
    //}
    for (var i = 1; i < lines.length; i++) {
        line = lines[i].trim().split(" ");
        request.headers[line[0].slice(0, line[0].length - 1)] = line[1];
    }
    request.isPersistent = !(request.ver == "1.0"
        && string.indexOf("keep-alive") > -1) || string.indexOf("close") > -1;
    return request;
};

