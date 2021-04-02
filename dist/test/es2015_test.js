"use strict";
/* global describe, it */
/* eslint-disable no-unused-expressions */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Assertions and Stubbing
const chai = require('chai');
const sinon_1 = __importDefault(require("sinon"));
// Hubot classes
const es2015_1 = __importDefault(require("../es2015"));
const mockery_1 = __importDefault(require("mockery"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
chai.use(sinon_chai_1.default);
const expect = chai.expect;
const User = es2015_1.default.User;
const Brain = es2015_1.default.Brain;
const Robot = es2015_1.default.Robot;
const Adapter = es2015_1.default.Adapter;
const Response = es2015_1.default.Response;
const Listener = es2015_1.default.Listener;
const TextListener = es2015_1.default.TextListener;
const Message = es2015_1.default.Message;
const TextMessage = es2015_1.default.TextMessage;
const EnterMessage = es2015_1.default.EnterMessage;
const LeaveMessage = es2015_1.default.LeaveMessage;
const TopicMessage = es2015_1.default.TopicMessage;
const CatchAllMessage = es2015_1.default.CatchAllMessage;
const loadBot = es2015_1.default.loadBot;
describe('hubot/es2015', function () {
    it('exports User class', function () {
        class MyUser extends User {
        }
        const user = new MyUser('id123', { foo: 'bar' });
        expect(user).to.be.an.instanceof(User);
        expect(user.id).to.equal('id123');
        expect(user.foo).to.equal('bar');
    });
    it('exports Brain class', function () {
        class MyBrain extends Brain {
        }
        const robotMock = {
            on: sinon_1.default.spy()
        };
        // @ts-ignore
        const brain = new MyBrain(robotMock);
        expect(brain).to.be.an.instanceof(Brain);
        expect(robotMock.on).to.have.been.called;
        brain.set('foo', 'bar');
        expect(brain.get('foo')).to.equal('bar');
    });
    it('exports Robot class', function () {
        mockery_1.default.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery_1.default.registerMock('hubot-mock-adapter', require('./fixtures/mock-adapter'));
        class MyRobot extends Robot {
        }
        const robot = new MyRobot(null, 'mock-adapter', false, 'TestHubot');
        expect(robot).to.be.an.instanceof(MyRobot);
        expect(robot.name).to.equal('TestHubot');
        mockery_1.default.disable();
    });
    it('exports Adapter class', function () {
        class MyAdapter extends Adapter {
        }
        const adapter = new MyAdapter('myrobot');
        expect(adapter).to.be.an.instanceof(Adapter);
        expect(adapter.robot).to.equal('myrobot');
    });
    it('exports Response class', function () {
        class MyResponse extends Response {
        }
        const robotMock = 'robotMock';
        const messageMock = {
            room: 'room',
            user: 'user'
        };
        const matchMock = 'matchMock';
        // @ts-ignore
        const response = new MyResponse(robotMock, messageMock, matchMock);
        expect(response).to.be.an.instanceof(Response);
        expect(response.message).to.equal(messageMock);
        expect(response.match).to.equal(matchMock);
    });
    it('exports Listener class', function () {
        class MyListener extends Listener {
        }
        const robotMock = 'robotMock';
        const matcherMock = 'matchMock';
        const callback = sinon_1.default.spy();
        // @ts-ignore
        const listener = new MyListener(robotMock, matcherMock, callback);
        expect(listener).to.be.an.instanceof(Listener);
        expect(listener.robot).to.equal(robotMock);
        expect(listener.matcher).to.equal(matcherMock);
        expect(listener.options).to.deep.include({
            id: null
        });
        expect(listener.callback).to.equal(callback);
    });
    it('exports TextListener class', function () {
        class MyTextListener extends TextListener {
        }
        const robotMock = 'robotMock';
        const regex = /regex/;
        const callback = sinon_1.default.spy();
        // @ts-ignore
        const textListener = new MyTextListener(robotMock, regex, callback);
        expect(textListener).to.be.an.instanceof(TextListener);
        expect(textListener.regex).to.equal(regex);
    });
    it('exports Message class', function () {
        class MyMessage extends Message {
        }
        const userMock = {
            room: 'room'
        };
        // @ts-ignore
        const message = new MyMessage(userMock);
        expect(message).to.be.an.instanceof(Message);
        expect(message.user).to.equal(userMock);
    });
    it('exports TextMessage class', function () {
        class MyTextMessage extends TextMessage {
        }
        const userMock = {
            room: 'room'
        };
        // @ts-ignore
        const textMessage = new MyTextMessage(userMock, 'bla blah');
        expect(textMessage).to.be.an.instanceof(TextMessage);
        expect(textMessage).to.be.an.instanceof(Message);
        expect(textMessage.text).to.equal('bla blah');
    });
    it('exports EnterMessage class', function () {
        class MyEnterMessage extends EnterMessage {
        }
        const userMock = {
            room: 'room'
        };
        // @ts-ignore
        const enterMessage = new MyEnterMessage(userMock);
        expect(enterMessage).to.be.an.instanceof(EnterMessage);
        expect(enterMessage).to.be.an.instanceof(Message);
    });
    it('exports LeaveMessage class', function () {
        class MyLeaveMessage extends LeaveMessage {
        }
        const userMock = {
            room: 'room'
        };
        // @ts-ignore
        const leaveMessage = new MyLeaveMessage(userMock);
        expect(leaveMessage).to.be.an.instanceof(LeaveMessage);
        expect(leaveMessage).to.be.an.instanceof(Message);
    });
    it('exports TopicMessage class', function () {
        class MyTopicMessage extends TopicMessage {
        }
        const userMock = {
            room: 'room'
        };
        // @ts-ignore
        const topicMessage = new MyTopicMessage(userMock);
        expect(topicMessage).to.be.an.instanceof(TopicMessage);
        expect(topicMessage).to.be.an.instanceof(Message);
    });
    it('exports CatchAllMessage class', function () {
        class MyCatchAllMessage extends CatchAllMessage {
        }
        const messageMock = {
            user: {
                room: 'room'
            }
        };
        // @ts-ignore
        const catchAllMessage = new MyCatchAllMessage(messageMock);
        expect(catchAllMessage).to.be.an.instanceof(CatchAllMessage);
        expect(catchAllMessage).to.be.an.instanceof(Message);
        expect(catchAllMessage.message).to.equal(messageMock);
        expect(catchAllMessage.user).to.equal(messageMock.user);
    });
    it('exports loadBot function', function () {
        sinon_1.default.stub(es2015_1.default, 'Robot');
        expect(loadBot).to.be.a('function');
        es2015_1.default.loadBot(undefined, 'shell', false, 'botName', 'botAlias');
    });
});
//# sourceMappingURL=es2015_test.js.map