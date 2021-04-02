import Robot from "./robot";
export default class Response {
    robot: any;
    message: any;
    match: any;
    envelope: {
        room: any;
        user: any;
        message: any;
    };
    constructor(robot: Robot, message: any, match: any);
    send(...strings: string[]): void;
    emote(...strings: string[]): void;
    reply(...strings: string[]): void;
    topic(...strings: string[]): void;
    play(...strings: string[]): void;
    locked(...strings: string[]): void;
    runWithMiddleware(methodName: string, opts: {
        [key: string]: any;
    }, strings: string[]): any;
    random(items: any[]): any;
    finish(): void;
    http(url: string, options: object): any;
}
//# sourceMappingURL=response.d.ts.map