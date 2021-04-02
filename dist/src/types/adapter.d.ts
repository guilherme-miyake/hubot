/// <reference types="node" />
import { EventEmitter } from "events";
import Robot from "../robot";
export default class Adapter extends EventEmitter {
    readonly robot: Robot | any;
    constructor(robot?: Robot | any);
    emote(envelope: object, ...strings: string[]): any;
    send(envelope: object, ...strings: string[]): void;
    reply(envelope: object, ...strings: string[]): void;
    topic(envelope: object, ...strings: string[]): void;
    play(envelope: object, ...strings: string[]): void;
    run(): void;
    close(): void;
    receive(message: any): void;
    users(): any;
    userForId(id: string, options: any): any;
    userForName(name: string): any;
    usersForRawFuzzyName(fuzzyName: string): any;
    usersForFuzzyName(fuzzyName: string): any;
    http(url: string): any;
}
//# sourceMappingURL=adapter.d.ts.map