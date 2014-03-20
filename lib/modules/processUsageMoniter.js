var usage = require("usage");

var DEFAULT_PROC_USAGE_INTERVAL = 1;
var DEFAULT_NOTIFY_MASTER_INTERVAL = 6;

var DEFAULT_WARNING_VALUE = 80;

module.exports = function (opts, consoleService) {
	return new Module(opts, consoleService)
}

module.exports.moduleId = "__processUsageMoniter__";

exports = module.exports;

var Module = function (opts, consoleService) {
	this.opts = opts || {};
	this.app = opts.app;
	this.opts = opts.opts || {};
	this.service = opts.service;
	this.warningValue = this.opts.warningValue || DEFAULT_WARNING_VALUE; //警告值，当process usage > warning 通知master
	this.procUsageInterval = (this.opts.procUsageInterval || DEFAULT_PROC_USAGE_INTERVAL) * 1000;
	this.notifyMasterInterval = (this.opts.notifyMasterInterval || DEFAULT_NOTIFY_MASTER_INTERVAL) * 1000;
	this.consoleService = consoleService;
	this.cpuUsage = 0;

	this.serverId = this.app.getServerId();
	this.curServer = this.app.getCurServer();
	//
	this.service.processUsageModule = this;
	this.service.consoleService = consoleService;
}

Module.prototype.start = function (cb) {
	usageTick(this, this.procUsageInterval);
	notifyMasterTick(this, this.notifyMasterInterval);
	cb();
}

Module.prototype.configure = function (opts) {

}

Module.prototype.moniterHandler = function (agent, msg, cb) {
	if (msg) {
		this.service.onMasterMessage(msg, cb);
	}
}

Module.prototype.updateCpuUsage = function () {
	usage.lookup(process.pid, opts, function (err, result) {
		if (!err && result) {
			this.cpuUsage = result.cpu;
		}
	})
}

// 监视进程负载, 使用setTimeout是为了能方便修改interval
function usageTick(module) {
	var opts = {keepHistory: true}
	setTimeout(function () {
		usage.lookup(process.pid, opts, function (err, result) {
			if (!err && result) {
				module.cpuUsage = result.cpu;
			}
			usageTick(module);
		})
		//module.consoleService.agent
	}, module.procUsageInterval);
}

// 通知moniter 当前进程的cpu负载
function notifyMasterTick(module) {
	setTimeout(function () {
		module.service.onMoniterMessage({action: "processUsageNotify", body: {serverId: module.serverId, cpuUsage: module.cpuUsage}})
		// TODO 需要改进usage package，不能简单的clearHistory，要使cpu负载值表示最近某段
		// 时间内的负载
		// TODO only work on linux
		//usage.clearHistory(process.pid);
		notifyMasterTick(module);
	}, module.notifyMasterInterval);
}

