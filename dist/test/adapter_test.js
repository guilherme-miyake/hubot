'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global describe, beforeEach, it */
const chai_1 = __importDefault(require("chai"));
const sinon_1 = __importDefault(require("sinon"));
const adapter_1 = __importDefault(require("../src/types/adapter"));
chai_1.default.use(require('sinon-chai'));
const expect = chai_1.default.expect;
describe('Adapter', function () {
    beforeEach(function () {
        this.robot = { receive: sinon_1.default.spy() };
    });
    // this one is hard, as it requires files
    it('can load adapter by name', () => { });
    describe('Public API', function () {
        beforeEach(function () {
            this.adapter = new adapter_1.default(this.robot);
        });
        it('assigns robot', function () {
            expect(this.adapter.robot).to.equal(this.robot);
        });
        describe('send', function () {
            it('is a function', function () {
                expect(this.adapter.send).to.be.a('function');
            });
            it('does nothing', function () {
                this.adapter.send({}, 'nothing');
            });
        });
        describe('reply', function () {
            it('is a function', function () {
                expect(this.adapter.reply).to.be.a('function');
            });
            it('does nothing', function () {
                this.adapter.reply({}, 'nothing');
            });
        });
        describe('topic', function () {
            it('is a function', function () {
                expect(this.adapter.topic).to.be.a('function');
            });
            it('does nothing', function () {
                this.adapter.topic({}, 'nothing');
            });
        });
        describe('play', function () {
            it('is a function', function () {
                expect(this.adapter.play).to.be.a('function');
            });
            it('does nothing', function () {
                this.adapter.play({}, 'nothing');
            });
        });
        describe('run', function () {
            it('is a function', function () {
                expect(this.adapter.run).to.be.a('function');
            });
            it('does nothing', function () {
                this.adapter.run();
            });
        });
        describe('close', function () {
            it('is a function', function () {
                expect(this.adapter.close).to.be.a('function');
            });
            it('does nothing', function () {
                this.adapter.close();
            });
        });
    });
    it('dispatches received messages to the robot', function () {
        this.robot.receive = sinon_1.default.spy();
        this.adapter = new adapter_1.default(this.robot);
        this.message = sinon_1.default.spy();
        this.adapter.receive(this.message);
        expect(this.robot.receive).to.have.been.calledWith(this.message);
    });
});
//# sourceMappingURL=adapter_test.js.map