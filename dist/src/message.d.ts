import User from "./user";
export default class Message {
    user: any;
    done: boolean;
    room: any;
    id?: string;
    constructor(user: User, done?: boolean, id?: string);
    finish(): void;
}
export declare class TextMessage extends Message {
    text: string;
    id: string;
    private?: boolean;
    constructor(user: User, text: string, id?: string);
    match(regex: RegExp): RegExpMatchArray;
    toString(): string;
}
export declare class EnterMessage extends Message {
}
export declare class LeaveMessage extends Message {
}
export declare class TopicMessage extends TextMessage {
}
export declare class CatchAllMessage extends Message {
    message: Message;
    constructor(message: Message);
}
//# sourceMappingURL=message.d.ts.map