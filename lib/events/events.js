module.exports = function (app, opts) {
	return new Event(app, opts);
}

var Event = function (app, opts) {
	this.app = app;
	this.opts = opts;
}

Event.prototype.add_servers = function (servers) {

};

Event.prototype.remove_servers = function (ids) {

};

Event.prototype.replace_servers = function (servers) {

};

Event.prototype.bind_session = function (session) {

};

Event.prototype.close_session = function (session) {

};
