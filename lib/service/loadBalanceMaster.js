var processUsageMaster = require("../modules/processUsageMaster.js");
var processUsageMoniter = require("../modules/processUsageMoniter.js");

var LoadBalance = function (app, opts) {
	this.app = app;
	this.opts = opts || {};
	this.router = opts.router;
}

module.exports = LoadBalance;

LoadBalance.prototype.start = function (cb) {
	this.app.registerAdmin(processUsageMaster, {app: this.app, opts: this.opts, service: this});
	cb();
}

// 监听服务器变化事件
LoadBalance.prototype.afterStart = function (cb) {
	cb();
}

LoadBalance.prototype.stop = function (force, cb) {
	cb();
}
