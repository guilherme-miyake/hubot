"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = exports.MockAdapter = void 0;
const adapter_1 = __importDefault(require("../../src/types/adapter"));
class MockAdapter extends adapter_1.default {
    constructor(robot) {
        super(robot);
    }
    send(envelope, ...strings) {
        this.emit('send', envelope, strings);
    }
    reply(envelope, ...strings) {
        this.emit('reply', envelope, strings);
    }
    topic(envelope, ...strings) {
        this.emit('topic', envelope, strings);
    }
    play(envelope, ...strings) {
        this.emit('play', envelope, strings);
    }
    run() {
        this.emit('connected');
    }
    close() {
        this.emit('closed');
    }
}
exports.MockAdapter = MockAdapter;
const use = robot => new MockAdapter(robot);
exports.use = use;
//# sourceMappingURL=mock-adapter.js.map