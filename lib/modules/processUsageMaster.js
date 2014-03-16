module.exports = function (opts, consoleService) {
	return new Module(opts, consoleService)
}

module.exports.moduleId = "__processUsageMaster__";

exports = module.exports;

var Module = function (opts, consoleService) {
	opts = opts || {};
	this.app = opts.app;
	this.opts = opts.opts || {};
	this.service = opts.service;
	this.actions = {
		processUsageNotify   : processUsageNotify,
		processToobusyWarning: processToobusyWarning
	}
}

Module.prototype.start = function (cb) {
	cb();
}

Module.prototype.masterHandler = function (agent, msg, cb) {
	if (msg) {
		var func = this.actions[msg.action];
		func && func(msg.msg);
	}
}

function processUsageNotify(msg) {

}

function processToobusyWarning(msg) {

}
