'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const async = require('async');
function withContext(self, context, func) {
    return (...arg) => func(self, context, ...arg);
}
class Middleware {
    constructor(robot) {
        this.robot = robot;
        this.stack = [];
    }
    // Enrich a function call with a context
    // Execute a single piece of middleware and update the completion callback
    // (each piece of middleware can wrap the 'done' callback with additional
    // logic).
    executeSingleMiddleware(self, context, stackItem, middlewareFunc, cb) {
        // Match the async.reduce interface
        function nextFunc(newDoneFunc) {
            cb(null, newDoneFunc || stackItem);
        }
        // Catch errors in synchronous middleware
        try {
            middlewareFunc(context, nextFunc, stackItem);
        }
        catch (err) {
            // Maintaining the existing error interface (Response object)
            // @ts-ignore
            self.robot.emit('error', err, context.response);
            // Forcibly fail the middleware and stop executing deeper
            stackItem();
        }
    }
    // Public: Execute all middleware in order and call 'next' with the latest
    // 'done' callback if last middleware calls through. If all middleware is
    // compliant, 'done' should be called with no arguments when the entire
    // round trip is complete.
    //
    // context - context object that is passed through the middleware stack.
    //     When handling errors, this is assumed to have a `response` property.
    //
    // next(context, done) - Called when all middleware is complete (assuming
    //     all continued by calling respective 'next' functions)
    //
    // done() - Initial (final) completion callback. May be wrapped by
    //     executed middleware.
    //
    // Returns nothing
    // Returns before executing any middleware
    execute(context, next, done) {
        if (done == null) {
            done = function () { };
        }
        // Executed when the middleware stack is finished
        function allDone(_, finalDoneFunc) {
            next(context, finalDoneFunc);
        }
        // Execute each piece of middleware, collecting the latest 'done' callback
        // at each step.
        process.nextTick(async.reduce.bind(null, this.stack, done, withContext(this, context, this.executeSingleMiddleware), allDone));
    }
    // Public: Registers new middleware
    //
    // middleware - A generic pipeline component function that can either
    //              continue the pipeline or interrupt it. The function is called
    //              with (robot, context, next, done). If execution should
    //              continue (next middleware, final callback), the middleware
    //              should call the 'next' function with 'done' as an optional
    //              argument.
    //              If not, the middleware should call the 'done' function with
    //              no arguments. Middleware may wrap the 'done' function in
    //              order to execute logic after the final callback has been
    //              executed.
    //
    // Returns nothing.
    register(middleware) {
        if (middleware.length !== 3) {
            throw new Error(`Incorrect number of arguments for middleware callback (expected 3, got ${middleware.length})`);
        }
        this.stack.push(middleware);
    }
}
exports.default = Middleware;
//# sourceMappingURL=middleware.js.map