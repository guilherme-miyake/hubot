import Robot from "./robot";
import Response from "./response";
import Listener from "./listener";
interface Context {
    response: Response;
    listener?: Listener;
}
export default class Middleware {
    robot: Robot;
    stack: any[];
    constructor(robot: Robot);
    executeSingleMiddleware(self: any, context: Context, stackItem: CallableFunction, middlewareFunc: CallableFunction, cb: CallableFunction): void;
    execute(context: Context, next: (context: object, done: CallableFunction) => void, done: CallableFunction): void;
    register(middleware: CallableFunction): void;
}
export {};
//# sourceMappingURL=middleware.d.ts.map