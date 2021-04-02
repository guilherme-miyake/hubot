import Robot from "./robot";
export default class Listener {
    matcher: any;
    robot: any;
    options: any;
    callback: any;
    regex: any;
    constructor(robot: Robot, matcher: any, options: object, callback: CallableFunction);
    call(message: any, middleware: any, didMatchCallback?: CallableFunction): boolean;
}
export declare class TextListener extends Listener {
    constructor(robot: Robot, regex: RegExp, options: object, callback: CallableFunction);
}
//# sourceMappingURL=listener.d.ts.map