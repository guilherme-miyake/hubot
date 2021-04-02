'use strict'

import User from "./user";

export default class Message {
  user: any
  done: boolean = false
  room: any
  id?: string
  // Represents an incoming message from the chat.
  //
  // user - A User instance that sent the message.
  constructor (user: User, done?: boolean, id?:string) {
    this.user = user
    this.room = this.user.room
    this.id = id
    if (done) this.done = done
  }

  // Indicates that no other Listener should be called on this object
  //
  // Returns nothing.
  finish () {
    this.done = true
  }
}

export class TextMessage extends Message {
  // Represents an incoming message from the chat.
  //
  // user - A User instance that sent the message.
  // text - A String message.
  // id   - A String of the message ID.
  text: string
  id: string
  private?: boolean
  constructor (user: User, text: string, id: string = '') {
    super(user)
    this.text = text
    this.id = id
  }

  // Determines if the message matches the given regex.
  //
  // regex - A Regex to check.
  //
  // Returns a Match object or null.
  match (regex: RegExp) {
    return this.text.match(regex)
  }

  // String representation of a TextMessage
  //
  // Returns the message text
  toString () {
    return this.text
  }
}

// Represents an incoming user entrance notification.
//
// user - A User instance for the user who entered.
// text - Always null.
// id   - A String of the message ID.
export class EnterMessage extends Message {}

// Represents an incoming user exit notification.
//
// user - A User instance for the user who left.
// text - Always null.
// id   - A String of the message ID.
export class LeaveMessage extends Message {}

// Represents an incoming topic change notification.
//
// user - A User instance for the user who changed the topic.
// text - A String of the new topic
// id   - A String of the message ID.
export class TopicMessage extends TextMessage {}

export class CatchAllMessage extends Message {
  // Represents a message that no matchers matched.
  //
  // message - The original message.
  message: Message
  constructor (message:Message) {
    super(message.user)
    this.message = message
  }
}
