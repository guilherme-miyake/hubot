"use strict";
/* global describe, beforeEach, it */
/* eslint-disable no-unused-expressions */
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
// Assertions and Stubbing
const chai_1 = __importDefault(require("chai"));
const sinon_1 = __importDefault(require("sinon"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
// Hubot classes
const message_1 = require("../src/message");
const listener_1 = __importStar(require("../src/listener"));
const response_1 = __importDefault(require("../src/response"));
const user_1 = __importDefault(require("../src/user"));
chai_1.default.use(sinon_chai_1.default);
const expect = chai_1.default.expect;
describe('Listener', function () {
    beforeEach(function () {
        // Dummy robot
        this.robot = {
            // Re-throw AssertionErrors for clearer test failures
            emit(name, err, response) {
                if (err.constructor.name === 'AssertionError') {
                    return process.nextTick(function () {
                        throw err;
                    });
                }
            },
            // Ignore log messages
            logger: {
                debug() { }
            },
            // Why is this part of the Robot object??
            Response: response_1.default
        };
        // Test user
        this.user = new user_1.default({
            id: 1,
            name: 'hubottester',
            room: '#mocha'
        });
    });
    describe('Unit Tests', function () {
        describe('#call', function () {
            it('calls the matcher', function (done) {
                const callback = sinon_1.default.spy();
                const testMatcher = sinon_1.default.spy();
                const testMessage = {};
                // @ts-ignore
                const testListener = new listener_1.default(this.robot, testMatcher, callback);
                testListener.call(testMessage, function (_) {
                    expect(testMatcher).to.have.been.calledWith(testMessage);
                    done();
                });
            });
            it('passes the matcher result on to the listener callback', function (done) {
                const matcherResult = {};
                const testMatcher = sinon_1.default.stub().returns(matcherResult);
                const testMessage = {};
                const listenerCallback = response => expect(response.match).to.be.equal(matcherResult);
                // sanity check; matcherResult must be truthy
                expect(matcherResult).to.be.ok;
                // @ts-ignore
                const testListener = new listener_1.default(this.robot, testMatcher, listenerCallback);
                testListener.call(testMessage, function (result) {
                    // sanity check; message should have been processed
                    expect(testMatcher).to.have.been.called;
                    expect(result).to.be.ok;
                    done();
                });
            });
            describe('if the matcher returns true', function () {
                beforeEach(function () {
                    this.createListener = function (cb) {
                        // @ts-ignore
                        return new listener_1.default(this.robot, sinon_1.default.stub().returns(true), cb);
                    };
                });
                it('executes the listener callback', function (done) {
                    const listenerCallback = sinon_1.default.spy();
                    const testMessage = {};
                    const testListener = this.createListener(listenerCallback);
                    testListener.call(testMessage, function (_) {
                        expect(listenerCallback).to.have.been.called;
                        done();
                    });
                });
                it('returns true', function () {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    const result = testListener.call(testMessage);
                    expect(result).to.be.ok;
                });
                it('calls the provided callback with true', function (done) {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    testListener.call(testMessage, function (result) {
                        expect(result).to.be.ok;
                        done();
                    });
                });
                it('calls the provided callback after the function returns', function (done) {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    let finished = false;
                    testListener.call(testMessage, function (result) {
                        expect(finished).to.be.ok;
                        done();
                    });
                    finished = true;
                });
                it('handles uncaught errors from the listener callback', function (done) {
                    const testMessage = {};
                    const theError = new Error();
                    const listenerCallback = function (response) {
                        throw theError;
                    };
                    this.robot.emit = function (name, err, response) {
                        expect(name).to.equal('error');
                        expect(err).to.equal(theError);
                        expect(response.message).to.equal(testMessage);
                        done();
                    };
                    const testListener = this.createListener(listenerCallback);
                    testListener.call(testMessage, sinon_1.default.spy());
                });
                it('calls the provided callback with true if there is an error thrown by the listener callback', function (done) {
                    const testMessage = {};
                    const theError = new Error();
                    const listenerCallback = function (response) {
                        throw theError;
                    };
                    const testListener = this.createListener(listenerCallback);
                    testListener.call(testMessage, function (result) {
                        expect(result).to.be.ok;
                        done();
                    });
                });
                it('calls the listener callback with a Response that wraps the Message', function (done) {
                    const testMessage = {};
                    const listenerCallback = function (response) {
                        expect(response.message).to.equal(testMessage);
                        done();
                    };
                    const testListener = this.createListener(listenerCallback);
                    testListener.call(testMessage, sinon_1.default.spy());
                });
                it('passes through the provided middleware stack', function (testDone) {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    const testMiddleware = {
                        execute(context, next, done) {
                            expect(context.listener).to.be.equal(testListener);
                            expect(context.response).to.be.instanceof(response_1.default);
                            expect(context.response.message).to.be.equal(testMessage);
                            expect(next).to.be.a('function');
                            expect(done).to.be.a('function');
                            testDone();
                        }
                    };
                    testListener.call(testMessage, testMiddleware, sinon_1.default.spy());
                });
                it('executes the listener callback if middleware succeeds', function (testDone) {
                    const listenerCallback = sinon_1.default.spy();
                    const testMessage = {};
                    const testListener = this.createListener(listenerCallback);
                    testListener.call(testMessage, function (result) {
                        expect(listenerCallback).to.have.been.called;
                        // Matcher matched, so we true
                        expect(result).to.be.ok;
                        testDone();
                    });
                });
                it('does not execute the listener callback if middleware fails', function (testDone) {
                    const listenerCallback = sinon_1.default.spy();
                    const testMessage = {};
                    const testListener = this.createListener(listenerCallback);
                    const testMiddleware = {
                        execute(context, next, done) {
                            // Middleware fails
                            done();
                        }
                    };
                    testListener.call(testMessage, testMiddleware, function (result) {
                        expect(listenerCallback).to.not.have.been.called;
                        // Matcher still matched, so we true
                        expect(result).to.be.ok;
                        testDone();
                    });
                });
                it('unwinds the middleware stack if there is an error in the listener callback', function (testDone) {
                    const listenerCallback = sinon_1.default.stub().throws(new Error());
                    const testMessage = {};
                    let extraDoneFunc = null;
                    const testListener = this.createListener(listenerCallback);
                    const testMiddleware = {
                        execute(context, next, done) {
                            extraDoneFunc = sinon_1.default.spy(done);
                            next(context, extraDoneFunc);
                        }
                    };
                    testListener.call(testMessage, testMiddleware, function (result) {
                        // Listener callback was called (and failed)
                        expect(listenerCallback).to.have.been.called;
                        // Middleware stack was unwound correctly
                        expect(extraDoneFunc).to.have.been.called;
                        // Matcher still matched, so we true
                        expect(result).to.be.ok;
                        testDone();
                    });
                });
            });
            describe('if the matcher returns false', function () {
                beforeEach(function () {
                    this.createListener = function (cb) {
                        // @ts-ignore
                        return new listener_1.default(this.robot, sinon_1.default.stub().returns(false), cb);
                    };
                });
                it('does not execute the listener callback', function (done) {
                    const listenerCallback = sinon_1.default.spy();
                    const testMessage = {};
                    const testListener = this.createListener(listenerCallback);
                    testListener.call(testMessage, function (_) {
                        expect(listenerCallback).to.not.have.been.called;
                        done();
                    });
                });
                it('returns false', function () {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    const result = testListener.call(testMessage);
                    expect(result).to.not.be.ok;
                });
                it('calls the provided callback with false', function (done) {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    testListener.call(testMessage, function (result) {
                        expect(result).to.not.be.ok;
                        done();
                    });
                });
                it('calls the provided callback after the function returns', function (done) {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    let finished = false;
                    testListener.call(testMessage, function (result) {
                        expect(finished).to.be.ok;
                        done();
                    });
                    finished = true;
                });
                it('does not execute any middleware', function (done) {
                    const testMessage = {};
                    const testListener = this.createListener(function () { });
                    const testMiddleware = { execute: sinon_1.default.spy() };
                    testListener.call(testMessage, result => {
                        expect(testMiddleware.execute).to.not.have.been.called;
                        done();
                    });
                });
            });
        });
        describe('#constructor', function () {
            it('requires a matcher', () => expect(function () {
                return new listener_1.default(this.robot, undefined, {}, sinon_1.default.spy());
            }).to.throw(Error));
            it('requires a callback', function () {
                // No options
                expect(function () {
                    // @ts-ignore
                    return new listener_1.default(this.robot, sinon_1.default.spy());
                }).to.throw(Error);
                // With options
                expect(function () {
                    // @ts-ignore
                    return new listener_1.default(this.robot, sinon_1.default.spy(), {});
                }).to.throw(Error);
            });
            it('gracefully handles missing options', function () {
                const testMatcher = sinon_1.default.spy();
                const listenerCallback = sinon_1.default.spy();
                // @ts-ignore
                const testListener = new listener_1.default(this.robot, testMatcher, listenerCallback);
                // slightly brittle because we are testing for the default options Object
                expect(testListener.options).to.deep.equal({ id: null });
                expect(testListener.callback).to.be.equal(listenerCallback);
            });
            it('gracefully handles a missing ID (set to null)', function () {
                const testMatcher = sinon_1.default.spy();
                const listenerCallback = sinon_1.default.spy();
                const testListener = new listener_1.default(this.robot, testMatcher, {}, listenerCallback);
                expect(testListener.options.id).to.be.null;
            });
        });
        describe('TextListener', () => describe('#matcher', function () {
            it('matches TextMessages', function () {
                const callback = sinon_1.default.spy();
                // @ts-ignore
                const testMessage = new message_1.TextMessage(this.user, 'test');
                testMessage.match = sinon_1.default.stub().returns(true);
                const testRegex = /test/;
                // @ts-ignore
                const testListener = new listener_1.TextListener(this.robot, testRegex, callback);
                const result = testListener.matcher(testMessage);
                expect(result).to.be.ok;
                expect(testMessage.match).to.have.been.calledWith(testRegex);
            });
            it('does not match EnterMessages', function () {
                const callback = sinon_1.default.spy();
                const testMessage = new message_1.EnterMessage(this.user);
                // @ts-ignore
                testMessage.match = sinon_1.default.stub().returns(true);
                const testRegex = /test/;
                // @ts-ignore
                const testListener = new listener_1.TextListener(this.robot, testRegex, callback);
                const result = testListener.matcher(testMessage);
                expect(result).to.not.be.ok;
                // @ts-ignore
                expect(testMessage.match).to.not.have.been.called;
            });
        }));
    });
});
//# sourceMappingURL=listener_test.js.map