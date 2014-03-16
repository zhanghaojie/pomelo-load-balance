var toobusy = require("toobusy");

module.exports = function (maxLag, cb) {
	return new Filter(maxLag, cb);
}

function Filter(maxLag, cb) {
	toobusy.maxLag(maxLag);
	this.cb = cb;
	this.enabled = true;
}

Filter.prototype.before = function (msg, session, next) {
	if (this.enabled && toobusy()) {
		this.cb();
	}
	next();
}

Filter.prototype.enable = function (enabled) {
	this.enabled = enabled;
}

Filter.prototype.setMaxLag = function (maxLog) {
	toobusy.maxLag(maxLag);
}
