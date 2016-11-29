const LEVELS = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    DEBUG: 'debug'
};

var logger = class {
	constructor(config) {
		this.root = config.root || 'root';

		if (config.format) {
			this.format = config.format;
		}

		if (config.transport) {
			this.transport = config.transport;
		}
	}

    log(data, level) {
        this.level = level;
        this.data = data;

        const logObj = this.createLogObject();

        const message = this.format(logObj);

        this.transport(level, message);
    }

    createLogObject() {
        let rootObj;

        if (this.root) {
            rootObj = { root: this.root };
        }

        const data = typeof this.data == 'string' ? { message: this.data } : this.data;

        const logObj = Object.assign(rootObj, data, { level: this.level || 'info'});

        return logObj;
    }

    format(logObj) {
        return JSON.stringify(logObj);
    }

    transport(level, message) {
        const chalk = require('chalk');

        if (level == 'error') {
            console.log(chalk.red(message));
        }
        else if (level == 'warning') {
            console.log(chalk.yellow(message));
        }
        else if (level == 'debug') {
            console.log(chalk.blue(message));
        }
        else {
            //the default is info
            console.log(chalk.green(message));
        }

    }
}

module.exports = { logger, LEVELS };
