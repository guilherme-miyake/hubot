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
/* global describe, beforeEach, it, afterEach */
/* eslint-disable no-unused-expressions */
// Assertions and Stubbing
const chai = require('chai');
const sinon_1 = __importDefault(require("sinon"));
// Hubot classes
const robot_1 = __importDefault(require("../src/robot"));
const message_1 = require("../src/message");
const response_1 = __importDefault(require("../src/response"));
const middleware_1 = __importDefault(require("../src/middleware"));
const fixtures = __importStar(require("./fixtures/mock-adapter"));
chai.use(require('sinon-chai'));
const expect = chai.expect;
// mock `hubot-mock-adapter` module from fixture
const mockery = require('mockery');
describe('Middleware', function () {
    describe('Unit Tests', function () {
        beforeEach(function () {
            // Stub out event emitting
            this.robot = { emit: sinon_1.default.spy() };
            this.middleware = new middleware_1.default(this.robot);
        });
        describe('#execute', function () {
            it('executes synchronous middleware', function (testDone) {
                const testMiddleware = sinon_1.default.spy((context, next, done) => {
                    next(done);
                });
                this.middleware.register(testMiddleware);
                const middlewareFinished = function () {
                    expect(testMiddleware).to.have.been.called;
                    testDone();
                };
                this.middleware.execute({}, (_, done) => done(), middlewareFinished);
            });
            it('executes asynchronous middleware', function (testDone) {
                const testMiddleware = sinon_1.default.spy((context, next, done) => 
                // Yield to the event loop
                process.nextTick(() => next(done)));
                this.middleware.register(testMiddleware);
                const middlewareFinished = function (context, done) {
                    expect(testMiddleware).to.have.been.called;
                    testDone();
                };
                this.middleware.execute({}, (_, done) => done(), middlewareFinished);
            });
            it('passes the correct arguments to each middleware', function (testDone) {
                const testContext = {};
                const testMiddleware = (context, next, done) => 
                // Break out of middleware error handling so assertion errors are
                // more visible
                process.nextTick(function () {
                    // Check that variables were passed correctly
                    expect(context).to.equal(testContext);
                    next(done);
                });
                this.middleware.register(testMiddleware);
                this.middleware.execute(testContext, (_, done) => done(), () => testDone());
            });
            it('executes all registered middleware in definition order', function (testDone) {
                const middlewareExecution = [];
                const testMiddlewareA = (context, next, done) => {
                    middlewareExecution.push('A');
                    next(done);
                };
                const testMiddlewareB = function (context, next, done) {
                    middlewareExecution.push('B');
                    next(done);
                };
                this.middleware.register(testMiddlewareA);
                this.middleware.register(testMiddlewareB);
                const middlewareFinished = function () {
                    expect(middlewareExecution).to.deep.equal(['A', 'B']);
                    testDone();
                };
                this.middleware.execute({}, (_, done) => done(), middlewareFinished);
            });
            it('executes the next callback after the function returns when there is no middleware', function (testDone) {
                let finished = false;
                this.middleware.execute({}, function () {
                    expect(finished).to.be.ok;
                    testDone();
                }, function () { });
                finished = true;
            });
            it('always executes middleware after the function returns', function (testDone) {
                let finished = false;
                this.middleware.register(function (context, next, done) {
                    expect(finished).to.be.ok;
                    testDone();
                });
                this.middleware.execute({}, function () { }, function () { });
                finished = true;
            });
            it('creates a default "done" function', function (testDone) {
                let finished = false;
                this.middleware.register(function (context, next, done) {
                    expect(finished).to.be.ok;
                    testDone();
                });
                // we're testing the lack of a third argument here.
                this.middleware.execute({}, function () { });
                finished = true;
            });
            it('does the right thing with done callbacks', function (testDone) {
                // we want to ensure that the 'done' callbacks are nested correctly
                // (executed in reverse order of definition)
                const execution = [];
                const testMiddlewareA = function (context, next, done) {
                    execution.push('middlewareA');
                    next(function () {
                        execution.push('doneA');
                        done();
                    });
                };
                const testMiddlewareB = function (context, next, done) {
                    execution.push('middlewareB');
                    next(function () {
                        execution.push('doneB');
                        done();
                    });
                };
                this.middleware.register(testMiddlewareA);
                this.middleware.register(testMiddlewareB);
                const allDone = function () {
                    expect(execution).to.deep.equal(['middlewareA', 'middlewareB', 'doneB', 'doneA']);
                    testDone();
                };
                this.middleware.execute({}, 
                // Short circuit at the bottom of the middleware stack
                (_, done) => done(), allDone);
            });
            it('defaults to the latest done callback if none is provided', function (testDone) {
                // we want to ensure that the 'done' callbacks are nested correctly
                // (executed in reverse order of definition)
                const execution = [];
                const testMiddlewareA = function (context, next, done) {
                    execution.push('middlewareA');
                    next(function () {
                        execution.push('doneA');
                        done();
                    });
                };
                const testMiddlewareB = function (context, next, done) {
                    execution.push('middlewareB');
                    next();
                };
                this.middleware.register(testMiddlewareA);
                this.middleware.register(testMiddlewareB);
                const allDone = function () {
                    expect(execution).to.deep.equal(['middlewareA', 'middlewareB', 'doneA']);
                    testDone();
                };
                this.middleware.execute({}, 
                // Short circuit at the bottom of the middleware stack
                (_, done) => done(), allDone);
            });
            describe('error handling', function () {
                it('does not execute subsequent middleware after the error is thrown', function (testDone) {
                    const middlewareExecution = [];
                    const testMiddlewareA = function (context, next, done) {
                        middlewareExecution.push('A');
                        next(done);
                    };
                    const testMiddlewareB = function (context, next, done) {
                        middlewareExecution.push('B');
                        throw new Error();
                    };
                    const testMiddlewareC = function (context, next, done) {
                        middlewareExecution.push('C');
                        next(done);
                    };
                    this.middleware.register(testMiddlewareA);
                    this.middleware.register(testMiddlewareB);
                    this.middleware.register(testMiddlewareC);
                    const middlewareFinished = sinon_1.default.spy();
                    const middlewareFailed = () => {
                        expect(middlewareFinished).to.not.have.been.called;
                        expect(middlewareExecution).to.deep.equal(['A', 'B']);
                        testDone();
                    };
                    this.middleware.execute({}, middlewareFinished, middlewareFailed);
                });
                it('emits an error event', function (testDone) {
                    const testResponse = {};
                    const theError = new Error();
                    const testMiddleware = function (context, next, done) {
                        throw theError;
                    };
                    this.middleware.register(testMiddleware);
                    this.robot.emit = sinon_1.default.spy(function (name, err, response) {
                        expect(name).to.equal('error');
                        expect(err).to.equal(theError);
                        expect(response).to.equal(testResponse);
                    });
                    const middlewareFinished = sinon_1.default.spy();
                    const middlewareFailed = () => {
                        expect(this.robot.emit).to.have.been.called;
                        testDone();
                    };
                    this.middleware.execute({ response: testResponse }, middlewareFinished, middlewareFailed);
                });
                it('unwinds the middleware stack (calling all done functions)', function (testDone) {
                    let extraDoneFunc = null;
                    const testMiddlewareA = function (context, next, done) {
                        // Goal: make sure that the middleware stack is unwound correctly
                        extraDoneFunc = sinon_1.default.spy(done);
                        next(extraDoneFunc);
                    };
                    const testMiddlewareB = function (context, next, done) {
                        throw new Error();
                    };
                    this.middleware.register(testMiddlewareA);
                    this.middleware.register(testMiddlewareB);
                    const middlewareFinished = sinon_1.default.spy();
                    const middlewareFailed = function () {
                        // Sanity check that the error was actually thrown
                        expect(middlewareFinished).to.not.have.been.called;
                        expect(extraDoneFunc).to.have.been.called;
                        testDone();
                    };
                    this.middleware.execute({}, middlewareFinished, middlewareFailed);
                });
            });
        });
        describe('#register', function () {
            it('adds to the list of middleware', function () {
                const testMiddleware = function (context, next, done) { };
                this.middleware.register(testMiddleware);
                expect(this.middleware.stack).to.include(testMiddleware);
            });
            it('validates the arity of middleware', function () {
                const testMiddleware = function (context, next, done, extra) { };
                expect(() => this.middleware.register(testMiddleware)).to.throw(/Incorrect number of arguments/);
            });
        });
    });
    // Per the documentation in docs/scripting.md
    // Any new fields that are exposed to middleware should be explicitly
    // tested for.
    describe('Public Middleware APIs', function () {
        beforeEach(function () {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false
            });
            mockery.registerMock('hubot-mock-adapter', fixtures);
            this.robot = new robot_1.default(null, 'mock-adapter', false, 'TestHubot');
            this.robot.run();
            // Re-throw AssertionErrors for clearer test failures
            this.robot.on('error', function (name, err, response) {
                if (err != null && err.name === 'AssertionError') {
                    process.nextTick(function () {
                        throw err;
                    });
                }
            });
            this.user = this.robot.brain.userForId('1', {
                name: 'hubottester',
                room: '#mocha'
            });
            // Dummy middleware
            this.middleware = sinon_1.default.spy(function (context, next, done) { next(done); });
            this.testMessage = new message_1.TextMessage(this.user, 'message123');
            this.robot.hear(/^message123$/, function (response) { });
            this.testListener = this.robot.listeners[0];
        });
        afterEach(function () {
            mockery.disable();
            this.robot.shutdown();
        });
        describe('listener middleware context', function () {
            beforeEach(function () {
                this.robot.listenerMiddleware((context, next, done) => {
                    this.middleware(context, next, done);
                });
            });
            describe('listener', function () {
                it('is the listener object that matched', function (testDone) {
                    this.robot.receive(this.testMessage, () => {
                        expect(this.middleware).to.have.been.calledWithMatch(sinon_1.default.match.has('listener', sinon_1.default.match.same(this.testListener)), // context
                        sinon_1.default.match.any, // next
                        sinon_1.default.match.any // done
                        );
                        testDone();
                    });
                });
                it('has options.id (metadata)', function (testDone) {
                    this.robot.receive(this.testMessage, () => {
                        expect(this.middleware).to.have.been.calledWithMatch(sinon_1.default.match.has('listener', sinon_1.default.match.has('options', sinon_1.default.match.has('id'))), // context
                        sinon_1.default.match.any, // next
                        sinon_1.default.match.any // done
                        );
                        testDone();
                    });
                });
            });
            describe('response', () => it('is a Response that wraps the message', function (testDone) {
                this.robot.receive(this.testMessage, () => {
                    expect(this.middleware).to.have.been.calledWithMatch(sinon_1.default.match.has('response', sinon_1.default.match.instanceOf(response_1.default).and(sinon_1.default.match.has('message', sinon_1.default.match.same(this.testMessage)))), // context
                    sinon_1.default.match.any, // next
                    sinon_1.default.match.any // done
                    );
                    testDone();
                });
            }));
        });
        describe('receive middleware context', function () {
            beforeEach(function () {
                this.robot.receiveMiddleware((context, next, done) => {
                    this.middleware(context, next, done);
                });
            });
            describe('response', () => it('is a match-less Response object', function (testDone) {
                this.robot.receive(this.testMessage, () => {
                    expect(this.middleware).to.have.been.calledWithMatch(sinon_1.default.match.has('response', sinon_1.default.match.instanceOf(response_1.default).and(sinon_1.default.match.has('message', sinon_1.default.match.same(this.testMessage)))), // context
                    sinon_1.default.match.any, // next
                    sinon_1.default.match.any // done
                    );
                    testDone();
                });
            }));
        });
        describe('next', function () {
            beforeEach(function () {
                this.robot.listenerMiddleware((context, next, done) => {
                    this.middleware(context, next, done);
                });
            });
            it('is a function with arity one', function (testDone) {
                this.robot.receive(this.testMessage, () => {
                    expect(this.middleware).to.have.been.calledWithMatch(sinon_1.default.match.any, // context
                    sinon_1.default.match.func.and(sinon_1.default.match.has('length', sinon_1.default.match(1))), // next
                    sinon_1.default.match.any // done
                    );
                    testDone();
                });
            });
        });
        describe('done', function () {
            beforeEach(function () {
                this.robot.listenerMiddleware((context, next, done) => {
                    this.middleware(context, next, done);
                });
            });
            it('is a function with arity zero', function (testDone) {
                this.robot.receive(this.testMessage, () => {
                    expect(this.middleware).to.have.been.calledWithMatch(sinon_1.default.match.any, // context
                    sinon_1.default.match.any, // next
                    sinon_1.default.match.func.and(sinon_1.default.match.has('length', sinon_1.default.match(0))) // done
                    );
                    testDone();
                });
            });
        });
    });
});
//# sourceMappingURL=middleware_test.js.map