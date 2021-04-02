'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global describe, it */
const user_1 = __importDefault(require("../src/user"));
const chai_1 = require("chai");
console.log(user_1.default);
describe('User', () => describe('new', function () {
    it('uses id as the default name', function () {
        const user = new user_1.default('hubot');
        chai_1.expect(user.name).to.equal('hubot');
    });
    it('sets attributes passed in', function () {
        const user = new user_1.default('hubot', { foo: 1, bar: 2 });
        chai_1.expect(user.foo).to.equal(1);
        chai_1.expect(user.bar).to.equal(2);
    });
    it('uses name attribute when passed in, not id', function () {
        const user = new user_1.default('hubot', { name: 'tobuh' });
        chai_1.expect(user.name).to.equal('tobuh');
    });
}));
//# sourceMappingURL=user_test.js.map