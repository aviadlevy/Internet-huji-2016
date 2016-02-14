/**
 * Created by aviadle on 1/17/2016.
 */

var hujinet = require('./hujinet.js');

DynamicServer.prototype.usedPorts = [];

function DynamicServer(port, callback) {
    this.handlers = [];
    if (port in this.usedPorts) {
        callback("Port " + port + " is already in use");
        return;
    }
    try {
        this.server = hujinet.createServer(port, this.handlers);
        this.usedPorts.push(port);
        callback(); // no error
    }
    catch (err) {
        callback(err);
    }
}

DynamicServer.prototype.stop = function (callback) {
    this.server.close();
    if(callback)
        callback();
};

DynamicServer.prototype.pushHandler = function(resource, requestHandler, method){
    if (requestHandler === undefined) {
        requestHandler = resource;
        resource = "/";
    }
    this.handlers.push({method: method, resource: resource, handler: requestHandler});
};

DynamicServer.prototype.use = function (resource, requestHandler) {
    this.pushHandler(resource, requestHandler, "ALL");
};

DynamicServer.prototype.get = function (resource, requestHandler) {
    this.pushHandler(resource, requestHandler,"GET");
};
DynamicServer.prototype.post = function (resource, requestHandler) {
    this.pushHandler(resource, requestHandler, "POST");
};

DynamicServer.prototype.delete = function (resource, requestHandler) {
    this.pushHandler(resource, requestHandler, "DELETE");
};

DynamicServer.prototype.put = function (resource, requestHandler) {
    this.pushHandler(resource, requestHandler,"PUT");
};

exports.DynamicServer = DynamicServer;