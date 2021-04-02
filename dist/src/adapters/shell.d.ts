import Robot from "../robot";
import Adapter from "../types/adapter";
declare class Shell extends Adapter {
    [key: string]: any;
    constructor(robot: Robot);
    send(envelope: any, ...strings: string[]): void;
    emote(envelope: any, ...strings: string[]): void;
    reply(envelope: any, ...strings: string[]): void;
    run(): void;
    shutdown(): never;
    buildCli(): void;
}
export declare const use: (robot: Robot) => Shell;
export {};
//# sourceMappingURL=shell.d.ts.map