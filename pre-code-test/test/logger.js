const expect = require("chai").expect;
const fs = require('fs');
const yaml = require('js-yaml');

const {logger, LEVELS} = require('../logger');


describe('Logger', function() {
	/* Test that various config options get set when invoked */
	describe('Invocations', function() {
		it("sets root when passed in", function() {
			let rootLogger = new logger({ root: 'party' });
			expect(rootLogger.root).to.equal('party')
		});

		it("sets format when passed in", function() {
			let silly_formatter = function(logObj) {
				return false;
			};
			let rootLogger = new logger({ format: silly_formatter });
			expect(rootLogger.format).to.equal(silly_formatter)
		});

		it("sets transport when passed in", function() {
			let silly_transport = function() {}
			let rootLogger = new logger({ transport : silly_transport });
			expect(rootLogger.transport).to.equal(silly_transport)
		});
	});

	describe('Transport override', function() {
		it("Use file transport to output to a file", function() {
			let level = 'info',
			    path = `out/${level}.log`;

			let fileLogger = new logger({
				transport(level, message) {
					fs.writeFileSync(path, message);
				}
			});
			fileLogger.log({cwd: __dirname}, LEVELS.DEBUG);
			expect(fs.existsSync(path)).to.be.true
			// assuming mocha has some kind of tear down, delete any files left over from test
		});
	});

    describe('Formatting override', function() {
		it("return YAML as log format", function() {
			let yamlLogger = new logger({
				format(logObj) {
					return yaml.safeDump(logObj);
				}
			});

			// kind of cheating, but you get the point.
			yamlLogger.data = 'is this yaml?';
			let yaml_me_maybe = yamlLogger.format(yamlLogger.createLogObject())
			expect(yaml_me_maybe).to.equal('root: root\nmessage: is this yaml?\nlevel: info\n')
		});
	});
});
