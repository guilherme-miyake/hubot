/* global describe, it */
/* eslint-disable no-unused-expressions */

// Assertions and Stubbing
const chai = require('chai')
import sinon from 'sinon'

// Hubot classes
import Hubot from "../es2015";

import mockery from "mockery";

import sinon_chai from "sinon-chai";

chai.use(sinon_chai)
const expect = chai.expect
const User = Hubot.User
const Brain = Hubot.Brain
const Robot = Hubot.Robot
const Adapter = Hubot.Adapter
const Response = Hubot.Response
const Listener = Hubot.Listener
const TextListener = Hubot.TextListener
const Message = Hubot.Message
const TextMessage = Hubot.TextMessage
const EnterMessage = Hubot.EnterMessage
const LeaveMessage = Hubot.LeaveMessage
const TopicMessage = Hubot.TopicMessage
const CatchAllMessage = Hubot.CatchAllMessage
const loadBot = Hubot.loadBot

describe('hubot/es2015', function () {
  it('exports User class', function () {
    class MyUser extends User {}
    const user = new MyUser('id123', {foo: 'bar'})

    expect(user).to.be.an.instanceof(User)
    expect(user.id).to.equal('id123')
    expect(user.foo).to.equal('bar')
  })

  it('exports Brain class', function () {
    class MyBrain extends Brain {}
    const robotMock = {
      on: sinon.spy()
    }
    // @ts-ignore
    const brain = new MyBrain(robotMock)

    expect(brain).to.be.an.instanceof(Brain)
    expect(robotMock.on).to.have.been.called

    brain.set('foo', 'bar')
    expect(brain.get('foo')).to.equal('bar')
  })

  it('exports Robot class', function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    })
    mockery.registerMock('hubot-mock-adapter', require('./fixtures/mock-adapter'))

    class MyRobot extends Robot {}
    const robot = new MyRobot(null, 'mock-adapter', false, 'TestHubot')

    expect(robot).to.be.an.instanceof(MyRobot)
    expect(robot.name).to.equal('TestHubot')

    mockery.disable()
  })

  it('exports Adapter class', function () {
    class MyAdapter extends Adapter {}
    const adapter = new MyAdapter('myrobot')

    expect(adapter).to.be.an.instanceof(Adapter)
    expect(adapter.robot).to.equal('myrobot')
  })

  it('exports Response class', function () {
    class MyResponse extends Response {}
    const robotMock = 'robotMock'
    const messageMock = {
      room: 'room',
      user: 'user'
    }
    const matchMock = 'matchMock'
    // @ts-ignore
    const response = new MyResponse(robotMock, messageMock, matchMock)

    expect(response).to.be.an.instanceof(Response)
    expect(response.message).to.equal(messageMock)
    expect(response.match).to.equal(matchMock)
  })

  it('exports Listener class', function () {
    class MyListener extends Listener {}
    const robotMock = 'robotMock'
    const matcherMock = 'matchMock'
    const callback = sinon.spy()
    // @ts-ignore
    const listener = new MyListener(robotMock, matcherMock, callback)

    expect(listener).to.be.an.instanceof(Listener)
    expect(listener.robot).to.equal(robotMock)
    expect(listener.matcher).to.equal(matcherMock)
    expect(listener.options).to.deep.include({
      id: null
    })
    expect(listener.callback).to.equal(callback)
  })

  it('exports TextListener class', function () {
    class MyTextListener extends TextListener {}
    const robotMock = 'robotMock'
    const regex = /regex/
    const callback = sinon.spy()
    // @ts-ignore
    const textListener = new MyTextListener(robotMock, regex, callback)

    expect(textListener).to.be.an.instanceof(TextListener)
    expect(textListener.regex).to.equal(regex)
  })

  it('exports Message class', function () {
    class MyMessage extends Message {}
    const userMock = {
      room: 'room'
    }
    // @ts-ignore
    const message = new MyMessage(userMock)

    expect(message).to.be.an.instanceof(Message)
    expect(message.user).to.equal(userMock)
  })

  it('exports TextMessage class', function () {
    class MyTextMessage extends TextMessage {}
    const userMock = {
      room: 'room'
    }
    // @ts-ignore
    const textMessage = new MyTextMessage(userMock, 'bla blah')

    expect(textMessage).to.be.an.instanceof(TextMessage)
    expect(textMessage).to.be.an.instanceof(Message)
    expect(textMessage.text).to.equal('bla blah')
  })

  it('exports EnterMessage class', function () {
    class MyEnterMessage extends EnterMessage {}
    const userMock = {
      room: 'room'
    }
    // @ts-ignore
    const enterMessage = new MyEnterMessage(userMock)

    expect(enterMessage).to.be.an.instanceof(EnterMessage)
    expect(enterMessage).to.be.an.instanceof(Message)
  })

  it('exports LeaveMessage class', function () {
    class MyLeaveMessage extends LeaveMessage {}
    const userMock = {
      room: 'room'
    }
    // @ts-ignore
    const leaveMessage = new MyLeaveMessage(userMock)

    expect(leaveMessage).to.be.an.instanceof(LeaveMessage)
    expect(leaveMessage).to.be.an.instanceof(Message)
  })

  it('exports TopicMessage class', function () {
    class MyTopicMessage extends TopicMessage {}
    const userMock = {
      room: 'room'
    }
    // @ts-ignore
    const topicMessage = new MyTopicMessage(userMock)

    expect(topicMessage).to.be.an.instanceof(TopicMessage)
    expect(topicMessage).to.be.an.instanceof(Message)
  })

  it('exports CatchAllMessage class', function () {
    class MyCatchAllMessage extends CatchAllMessage {}
    const messageMock = {
      user: {
        room: 'room'
      }
    }
    // @ts-ignore
    const catchAllMessage = new MyCatchAllMessage(messageMock)

    expect(catchAllMessage).to.be.an.instanceof(CatchAllMessage)
    expect(catchAllMessage).to.be.an.instanceof(Message)
    expect(catchAllMessage.message).to.equal(messageMock)
    expect(catchAllMessage.user).to.equal(messageMock.user)
  })

  it('exports loadBot function', function () {
    sinon.stub(Hubot, 'Robot')
    expect(loadBot).to.be.a('function')
    Hubot.loadBot(undefined, 'shell', false, 'botName', 'botAlias')
  })
})