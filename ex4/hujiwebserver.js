/**
 * Created by aviadle on 15/12/18.
 */

var path = require('path');
var dynamicServer = require('./hujidynamicserver.js');

//process.on('uncaughtException', function (err) {
//    console.log(err);
//});

exports.start = function (port, callback) {
    //var absRootPath;
    //absRootPath = path.resolve(rootFolder);
    var serverObj;
    try {
        serverObj = new dynamicServer.DynamicServer(port, function (err) {
            if(err) console.log(err);
        });
    }
    catch (e) {
        callback(e);
        return;
    }
    // defineProperties set the property to read-only by default
    Object.defineProperty(serverObj, 'port', {value: port});
    // Note: the root folder variable that set here is not the absolute, but the path given by user!
    //Object.defineProperty(serverObj, 'rootFolder', {value: absRootPath});
    //serverObj.stop = function (callback) {
    //    this.stop(callback);
    //};
    callback(undefined, serverObj);
    return serverObj;
};

exports.static = function(rootFolder) {
    //rootFolder = path.resolve(rootFolder);
    var staticHandler = function (req, res, next) {
        res.sendFile(rootFolder + req.path, {root: rootFolder});
    };
    return staticHandler;
};