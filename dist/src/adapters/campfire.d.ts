/// <reference types="node" />
import Robot from "../robot";
import { EventEmitter } from "events";
import Adapter from "../types/adapter";
declare class Campfire extends Adapter {
    bot: CampfireStreaming;
    constructor(robot: Robot);
    send(envelope: any, ...strings: string[]): void;
    emote(envelope: any, ...strings: string[]): void;
    reply(envelope: any, ...strings: string[]): void;
    topic(envelope: any, ...strings: string[]): void;
    play(envelope: any, ...strings: string[]): void;
    locked(envelope: any, ...strings: string[]): void;
    run(): void;
}
declare class CampfireStreaming extends EventEmitter {
    robot: Robot;
    [key: string]: any;
    constructor(options: any, robot: Robot);
    Rooms(callback: CallableFunction): import("http").ClientRequest;
    User(id: string, callback: CallableFunction): import("http").ClientRequest;
    Me(callback: CallableFunction): import("http").ClientRequest;
    Room(id: string): {
        show(callback: CallableFunction): import("http").ClientRequest;
        join(callback: CallableFunction): import("http").ClientRequest;
        leave(callback: CallableFunction): import("http").ClientRequest;
        lock(callback: CallableFunction): import("http").ClientRequest;
        unlock(callback?: CallableFunction): import("http").ClientRequest;
        paste(text: string, callback: CallableFunction): any;
        topic(text: string, callback: CallableFunction): import("http").ClientRequest;
        sound(text: string, callback: CallableFunction): any;
        speak(text: string, callback: CallableFunction): import("http").ClientRequest;
        message(text: string, type: string, callback: CallableFunction): import("http").ClientRequest;
        listen(): any;
    };
    get(path: string, callback: CallableFunction): import("http").ClientRequest;
    post(path: string, body: any, callback: CallableFunction): import("http").ClientRequest;
    put(path: string, body: any, callback: CallableFunction): import("http").ClientRequest;
    request(method: string, path: string, body: any, callback: CallableFunction): import("http").ClientRequest;
}
declare const _default: {
    use: (robot: Robot) => Campfire;
};
export default _default;
//# sourceMappingURL=campfire.d.ts.map