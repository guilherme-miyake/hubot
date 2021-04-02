import Robot from "../../src/robot";

import Adapter from "../../src/types/adapter";

export class MockAdapter extends Adapter {
  constructor(robot:Robot) {
    super(robot);
  }

  send (envelope, ...strings) {
    this.emit('send', envelope, strings)
  }
  reply (envelope, ...strings) {
    this.emit('reply', envelope, strings)
  }
  topic (envelope, ...strings) {
    this.emit('topic', envelope, strings)
  }
  play (envelope, ...strings) {
    this.emit('play', envelope, strings)
  }
  run () {
    this.emit('connected')
  }
  close () {
    this.emit('closed')
  }
}

export const use = robot => new MockAdapter(robot)
