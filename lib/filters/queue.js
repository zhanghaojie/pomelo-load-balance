var DEFAULT_IN_COUNT = 10000;
var DEFAULT_EXPECT_CPU_USAGE = 90;

module.exports = function (opts) {
	return new Filter(opts);
}

function Filter(opts) {
	this.opts = opts || {};
	this.enabled = true;
	this.curInCount = 0;
	this.allowInCount = DEFAULT_IN_COUNT;
	this.queue = [];
	this.expectCpuUsage = this.expectCpuUsage || DEFAULT_EXPECT_CPU_USAGE;

	this.isCpuHigh = false;
	this.cpuUsageCallback = opts.cpuUsageCallback;
}

Filter.prototype.shift = function (count) {
	var i = count;
	while (i && this.queue.length > 0) {
		var next = this.queue.shift();
		next();
		this.curInCount++;
		i--;
	}
	return count - i;
}

Filter.prototype.before = function (msg, session, next) {
	this.update();
	var count = this.allowInCount - this.curInCount;
	if (count > 0) {
		var shiftCount = this.shift(count);
		if (shiftCount < count) {
			this.curInCount++;
			next();
		}
	}
	else {
		this.queue.push(next);
	}

}

Filter.prototype.update = function () {
	var cpuUsage = this.cpuUsageCallback();
	//console.log("cpuusage: " + cpuUsage);
	if (cpuUsage > this.expectCpuUsage) {
		if (this.isCpuHigh) {
			this.allowInCount--;
		}
		else {
			this.allowInCount = this.curInCount;
			this.isCpuHigh = true;
		}
	}
	else {
		if (this.queue.lengh > 0) {
			this.allowInCount++;
		}
		else {
			this.isCpuHigh = false;
		}
	}
}

Filter.prototype.after = function (err, msg, session, resp, next) {
	this.curInCount--;
	next();
}

Filter.prototype.enable = function (enabled) {
	this.enabled = enabled;
}
