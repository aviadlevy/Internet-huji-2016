/**
 * Created by aviadle on 1/17/2016.
 */

function HttpReq() {
    this.headers = {};
    this.params = {};
    this.body = "";
    this.bodyParams = {};
}
HttpReq.prototype.get = function (field) {
    if (this.headers) {
        return this.headers[field.toLowerCase()];
    }
};
HttpReq.prototype.param = function (name, defVal) {
    var value = defVal;

    if (name in this.params) {
        value = this.params[name];
    }
    else if (name in this.bodyParams) {
        value = this.bodyParams[name];
    }
    else if (name in this.query) {
        value = this.query[name];
    }
    return value;
};
HttpReq.prototype.is = function (type) {
    var contentType = this.headers["content-type"].split(";")[0].trim();
    var contentParts = contentType.split("/");
    var typeParts = type.split("/");

    return (contentType.trim() === type.trim() || contentParts[1].trim() === type.trim()
    || (typeParts[0].trim() === contentParts[0].trim() && typeParts[1].trim() === "*"))
};

exports.HttpReq = HttpReq;