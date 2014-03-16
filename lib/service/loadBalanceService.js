var processUsageMaster = require("../modules/processUsageMaster.js");
var processUsageMoniter = require("../modules/processUsageMoniter.js");
var util = require("../utils/util.js");

var CPU_MAX_USAGE = 95;

var processUsageMasterId = processUsageMaster.moduleId;
var processUsageMoniterId = processUsageMoniter.moduleId;

var LoadBalanceService = function (app, opts) {
	this.app = app;
	this.opts = opts || {};
	this.configure(opts);

	this.processUsageModule = null;
	this.consoleService = null;

	this.serverId = this.app.getServerId();
	this.curServer = this.app.getCurServer();
}

module.exports = LoadBalanceService;

exports = module.exports;

LoadBalanceService.prototype.start = function (cb) {
	this.app.registerAdmin(processUsageMoniter, {app: this.app, opts: this.opts, service: this});
	cb();
}

LoadBalanceService.prototype.afterStart = function (cb) {
	cb();
}

LoadBalanceService.prototype.stop = function (force, cb) {
	cb();
}

LoadBalanceService.prototype.configure = function (opts) {
	this.router = opts.router || this.router;
}

// 查询同类型负载最低的server
LoadBalanceService.prototype.queryServer = function (serverType) {

}

// 处理所有master发送的消息
LoadBalanceService.prototype.onMasterMessage = function (msg, cb) {

}

//处理所有moniter发送的消息
LoadBalanceService.prototype.onMoniterMessage = function (msg, cb) {
	var action = msg.action;
	if (action) {
		var actionFunc = moniterActions[action];
		util.invokeCallback(actionFunc.bind(null, this), msg);
	}
}

// 通知master当前process的cpu负载
function processUsageNotify(service, msg) {
	if (msg.cpuUsage > CPU_MAX_USAGE) {

	}
	service.consoleService.agent.notify(processUsageMasterId, msg);
}

var moniterActions = {
	processUsageNotify: processUsageNotify,
}
