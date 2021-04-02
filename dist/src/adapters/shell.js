'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = void 0;
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const stream_1 = __importDefault(require("stream"));
const cline_1 = __importDefault(require("cline"));
const chalk_1 = __importDefault(require("chalk"));
const adapter_1 = __importDefault(require("../types/adapter"));
const message_1 = require("../message");
const historySize = process.env.HUBOT_SHELL_HISTSIZE != null ? parseInt(process.env.HUBOT_SHELL_HISTSIZE) : 1024;
const historyPath = '.hubot_history';
class Shell extends adapter_1.default {
    constructor(robot) {
        super(robot);
    }
    send(envelope, ...strings) {
        Array.from(strings).forEach(str => console.log(chalk_1.default.bold(`${str}`)));
    }
    emote(envelope, ...strings) {
        Array.from(strings).map((str) => {
            this.send(envelope, `* ${str}`);
        });
    }
    reply(envelope, ...strings) {
        // @ts-ignore
        this.send.apply(this, [envelope].concat(strings));
    }
    run() {
        this.buildCli();
        loadHistory((error, history) => {
            if (error) {
                console.log(error.message);
            }
            this.cli.history(history);
            this.cli.interact(`${this.robot.name}> `);
            return this.emit('connected');
        });
    }
    shutdown() {
        this.robot.shutdown();
        return process.exit(0);
    }
    buildCli() {
        this.cli = cline_1.default();
        this.cli.command('*', (input) => {
            let userId = process.env.HUBOT_SHELL_USER_ID || 1;
            if (typeof userId == 'string' && userId.match(/A\d+z/)) {
                userId = parseInt(userId);
            }
            const userName = process.env.HUBOT_SHELL_USER_NAME || 'Shell';
            const user = this.robot.brain.userForId(userId, { name: userName, room: 'Shell' });
            this.receive(new message_1.TextMessage(user, input, 'messageId'));
        });
        this.cli.command('history', () => {
            Array.from(this.cli.history()).map(item => console.log(item));
        });
        this.cli.on('history', (item) => {
            if (item.length > 0 && item !== 'exit' && item !== 'history') {
                fs_1.default.appendFile(historyPath, `${item}\n`, (error) => {
                    if (error) {
                        this.robot.emit('error', error);
                    }
                });
            }
        });
        this.cli.on('close', () => {
            let fileOpts, history, i, item, len, outstream, startIndex;
            history = this.cli.history();
            if (history.length <= historySize) {
                return this.shutdown();
            }
            startIndex = history.length - historySize;
            history = history.reverse().splice(startIndex, historySize);
            fileOpts = {
                mode: 0x180
            };
            outstream = fs_1.default.createWriteStream(historyPath, fileOpts);
            outstream.on('finish', this.shutdown.bind(this));
            for (i = 0, len = history.length; i < len; i++) {
                item = history[i];
                outstream.write(item + '\n');
            }
            outstream.end(this.shutdown.bind(this));
        });
    }
}
const use = (robot) => {
    return new Shell(robot);
};
exports.use = use;
// load history from .hubot_history.
//
// callback - A Function that is called with the loaded history items (or an empty array if there is no history)
function loadHistory(callback) {
    if (!fs_1.default.existsSync(historyPath)) {
        return callback(new Error('No history available'));
    }
    const instream = fs_1.default.createReadStream(historyPath);
    const outstream = new stream_1.default();
    const items = [];
    // @ts-ignore
    readline_1.default.createInterface(instream, outstream, false)
        .on('line', function (line) {
        line = line.trim();
        if (line.length > 0) {
            items.push(line);
        }
    })
        .on('close', () => callback(null, items))
        .on('error', callback);
}
//# sourceMappingURL=shell.js.map