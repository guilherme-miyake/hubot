'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const optparse_1 = require("optparse");
const hubot_1 = require("./hubot");
// @ts-ignore
const __1 = __importDefault(require(".."));
const switches = [
    ['-a', '--adapter ADAPTER', 'The Adapter to use'],
    ['-c', '--create PATH', 'Create a deployable hubot'],
    ['-d', '--disable-httpd', 'Disable the HTTP server'],
    ['-h', '--help', 'Display the help information'],
    ['-l', '--alias ALIAS', "Enable replacing the robot's name with alias"],
    ['-n', '--name NAME', 'The name of the robot in chat'],
    ['-r', '--require PATH', 'Alternative scripts path'],
    ['-t', '--config-check', "Test hubot's config to make sure it won't fail at startup"],
    ['-v', '--version', 'Displays the version of hubot installed']
];
const options = {
    adapter: process.env.HUBOT_ADAPTER || 'shell',
    alias: Boolean(process.env.HUBOT_ALIAS) || false,
    create: Boolean(process.env.HUBOT_CREATE) || false,
    enableHttpd: Boolean(process.env.HUBOT_HTTPD) || true,
    scripts: ((_a = process.env.HUBOT_SCRIPTS) === null || _a === void 0 ? void 0 : _a.split(",")) || [],
    name: process.env.HUBOT_NAME || 'Hubot',
    path: process.env.HUBOT_PATH || '.',
    configCheck: false,
};
const Parser = new optparse_1.OptionParser(switches);
Parser.banner = 'Usage hubot [options]';
Parser.on('adapter', (opt, value) => {
    options.adapter = value;
});
Parser.on('create', function (opt, value) {
    options.path = value;
    options.create = true;
});
Parser.on('disable-httpd', (opt) => {
    options.enableHttpd = false;
});
Parser.on('help', function (opt, value) {
    console.log(Parser.toString());
    return process.exit(0);
});
Parser.on('alias', function (opt, value) {
    if (!value) {
        value = '/';
    }
    options.alias = value;
});
Parser.on('name', (opt, value) => {
    options.name = value;
});
Parser.on('require', (opt, value) => {
    options.scripts.push(value);
});
Parser.on('config-check', (opt) => {
    options.configCheck = true;
});
Parser.on('version', (opt, value) => {
    options.version = true;
});
Parser.on((opt, value) => {
    console.warn(`Unknown option: ${opt}`);
});
Parser.parse(process.argv);
if (process.platform !== 'win32') {
    process.on('SIGTERM', () => process.exit(0));
}
if (options.create) {
    console.error("'hubot --create' is deprecated. Use the yeoman generator instead:");
    console.error('    npm install -g yo generator-hubot');
    console.error(`    mkdir -p ${options.path}`);
    console.error(`    cd ${options.path}`);
    console.error('    yo hubot');
    console.error('See https://github.com/github/hubot/blob/master/docs/index.md for more details on getting started.');
    process.exit(1);
}
const robot = __1.default.loadBot(undefined, options.adapter, options.enableHttpd, options.name, options.alias);
if (options.version) {
    console.log(robot.version);
    process.exit(0);
}
if (options.configCheck) {
    hubot_1.loadScripts(robot, options);
    console.log('OK');
    process.exit(0);
}
robot.adapter.once('connected', hubot_1.loadScripts);
robot.run();
//# sourceMappingURL=hubot-cli.js.map