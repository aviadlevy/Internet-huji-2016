/**
 * Created by aviadle on 1/17/2016.
 */

var parser = require('./hujirequestparser.js');
var fs = require("fs");
var path = require("path");

function HttpRes(socket) {
    this.socket = socket;
    this.headers = socket.req.headers;
    this.doneHeaders = false;
    this.filesSent = true;
    this.statusReason = '';
}
HttpRes.prototype.set = function (field, value) {
    if (value) {
        this.headers[field.toLowerCase()] = value;
    }
    else {
        for (var key in field) {
            this.headers[key.toLowerCase()] = field[key];
        }
    }
};
HttpRes.prototype.status = function (code) {
    switch (code) {
    case 200:
        this.statusReason = 'OK';
        break;
    case 400:
        this.statusReason = 'Bad Request';
        break;
    case 403:
        this.statusReason = 'Forbidden';
        break;
    case 404:
        this.statusReason = 'The requested resource not found';
        //this.statusReason = 'Not Found';
        break;
    default: // stands for case 500
        this.statusReason = 'Internal Server Error';
        break;
    }
    this.statusCode = code;
    return this;
};
HttpRes.prototype.get = function (field) {
    if (this.headers) {
        return this.headers[field.toLowerCase()];
    }
};
HttpRes.prototype.cookie = function (name, value, options) {
    if (!this.cookieHeaders) {
        this.cookieHeaders = [];
    }
    var tempCook = name + '=' + value;
    for (var i in options) {
        tempCook += ';'  + " ";
        switch (i) {
        case 'expires':
            tempCook += 'expires' + '=' + options[i].toGMTString();
            break;
        case 'path':
            tempCook += 'path' + "=" + options[i];
            break;
        case 'domain':
            tempCook += 'domain' + "=" + options[i];
            break;
        case 'maxAge':
            tempCook += 'max-age' + "=" + options[i];
            break;
        case 'secure':
            if (options[i]) {
                tempCook += 'secure' + "=" + "true";
            }
            break;
        case 'httpOnly':
            if (options[i]) {
                tempCook += 'httpOnly'  + "=" + "true";
            }
            break;
        default :
            break;
        }
    }
    this.set('set-cookie', tempCook);
    this.cookieHeaders.push(tempCook);
};
HttpRes.prototype.send = function (body) { // todo
    //if (this.doneHeaders) {
    //    return;
    //}
    if (body) {
        if (Buffer.isBuffer(body)) {
            if(!this.headers["content-type"]) {
                this.set("content-type", "application/octet-stream");
            }
            this.body = body.toString();
        }
        else if (typeof(body) === 'string') {
            if(this.headers["content-type"] === "application/json" && body !== "true" && body !== "false")
            {
                body = JSON.parse(body);
            }
            this.body = body;
            if (!this.headers["content-type"]) {
                this.set("content-type", "text/html");
            }
        }
        else {  // json
            this.body = JSON.stringify(body);
            this.set("content-type", "application/javascript");
        }
        if (!("content-length" in this.headers) || this.headers['content-length'] !== this.body.length) {
            this.set("content-length", this.body.length);
        }
    }
    this.socket.write(parser.stringify(this));
    if ((this.isEnd && this.filesSent) || this.statusCode === 500) {
        this.socket.end();
    }
    this.doneHeaders = true;
};
HttpRes.prototype.json = function (body) {
    if (body) {
        this.set("content-type", "application/javascript");
        this.send(JSON.stringify(body));
    }
    else if (body === null) {
        this.send("null")
    }
    else {
        this.send("undefined")
    }
};

HttpRes.prototype.sendFile = function (filePath, options) {
    var that = this;
    if (this.doneHeaders) {
        return;
    }
    this.filesSent = false;

    fs.stat(filePath, function (err, stats) {
        if (path.relative(options.root, filePath).substring(0, 2) === '..') {
            this.filesSent = true;
            that.status(403).send();
            return;
        }
        if (err|| stats.isDirectory()) { // if directory, ret 404 (ex3 instructions)
            this.filesSent = true;
            that.status(404).send();
            return;
        }
        that.status(200).set({
            "Content-Type": getTypeDic()[filePath.split('.').pop()],
            "Content-Length": stats.size
        });

        that.socket.write(parser.stringify(that)); // send headers
        that.socket.write(fs.readFileSync(filePath));
        this.filesSent = true;
    });
    this.doneHeaders = true;
};

var getTypeDic = function () {
    return {
        'js': 'application/javascript',
        'txt': 'text/plain',
        'html': 'text/html',
        'css': 'text/css',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png'
    }
};

exports.HttpRes = HttpRes;