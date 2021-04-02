'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAllMessage = exports.TopicMessage = exports.LeaveMessage = exports.EnterMessage = exports.TextMessage = void 0;
class Message {
    // Represents an incoming message from the chat.
    //
    // user - A User instance that sent the message.
    constructor(user, done, id) {
        this.done = false;
        this.user = user;
        this.room = this.user.room;
        this.id = id;
        if (done)
            this.done = done;
    }
    // Indicates that no other Listener should be called on this object
    //
    // Returns nothing.
    finish() {
        this.done = true;
    }
}
exports.default = Message;
class TextMessage extends Message {
    constructor(user, text, id = '') {
        super(user);
        this.text = text;
        this.id = id;
    }
    // Determines if the message matches the given regex.
    //
    // regex - A Regex to check.
    //
    // Returns a Match object or null.
    match(regex) {
        return this.text.match(regex);
    }
    // String representation of a TextMessage
    //
    // Returns the message text
    toString() {
        return this.text;
    }
}
exports.TextMessage = TextMessage;
// Represents an incoming user entrance notification.
//
// user - A User instance for the user who entered.
// text - Always null.
// id   - A String of the message ID.
class EnterMessage extends Message {
}
exports.EnterMessage = EnterMessage;
// Represents an incoming user exit notification.
//
// user - A User instance for the user who left.
// text - Always null.
// id   - A String of the message ID.
class LeaveMessage extends Message {
}
exports.LeaveMessage = LeaveMessage;
// Represents an incoming topic change notification.
//
// user - A User instance for the user who changed the topic.
// text - A String of the new topic
// id   - A String of the message ID.
class TopicMessage extends TextMessage {
}
exports.TopicMessage = TopicMessage;
class CatchAllMessage extends Message {
    constructor(message) {
        super(message.user);
        this.message = message;
    }
}
exports.CatchAllMessage = CatchAllMessage;
//# sourceMappingURL=message.js.map