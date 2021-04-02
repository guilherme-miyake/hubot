'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global describe, beforeEach, it */
/* eslint-disable no-unused-expressions */
// Assertions and Stubbing
const chai_1 = __importDefault(require("chai"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
// Hubot classes
const user_1 = __importDefault(require("../src/user"));
const message_1 = __importStar(require("../src/message"));
chai_1.default.use(sinon_chai_1.default);
const expect = chai_1.default.expect;
describe('Message', function () {
    beforeEach(function () {
        this.user = new user_1.default({
            id: 1,
            name: 'hubottester',
            room: '#mocha'
        });
    });
    describe('Unit Tests', function () {
        describe('#finish', () => it('marks the message as done', function () {
            const testMessage = new message_1.default(this.user);
            expect(testMessage.done).to.not.be.ok;
            testMessage.finish();
            expect(testMessage.done).to.be.ok;
        }));
        describe('TextMessage', () => describe('#match', () => it('should perform standard regex matching', function () {
            // @ts-ignore
            const testMessage = new message_1.TextMessage(this.user, 'message123');
            expect(testMessage.match(/^message123$/)).to.be.ok;
            expect(testMessage.match(/^does-not-match$/)).to.not.be.ok;
        })));
    });
});
//# sourceMappingURL=message_test.js.map