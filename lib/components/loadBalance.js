var LoadBalanceService = require("../service/loadBalanceService.js")
var LoadBalanceMaster = require("../service/loadBalanceMaster.js")

module.exports = function (app, opts) {
	var service = null;
	if (app.isMaster()) {
		service = new LoadBalanceMaster(app, opts);
		app.set("loadBalance", service);
		service.name = "__loadBalance__";
	}
	else {
		service = new LoadBalanceService(app, opts);
		app.set("loadBalanceService", service);
		service.name = '__loadBalanceService__';
	}
	return service;
}
