/**
 * Created by aviadle on 15/12/18.
 */

var path = require('path');
var hujinet = require('./hujinet.js');

//process.on('uncaughtException', function (err) {
//    console.log(err);
//});

exports.start = function (port, rootFolder, callback) {
    var absRootPath, serverObj;
    absRootPath = path.resolve(rootFolder);
    try {
        serverObj = hujinet.initServer(port, absRootPath);
    }
    catch (e) {
        callback(e);
        return;
    }
    // defineProperties set the property to read-only by default
    Object.defineProperty(serverObj, 'port', {value: port});
    // Note: the root folder variable that set here is not the absolute, but the path given by user!
    Object.defineProperty(serverObj, 'rootFolder', {value: absRootPath});
    serverObj.stop = function (callback) {
        this.close();
        callback();
    };
    callback();
    return serverObj;
};