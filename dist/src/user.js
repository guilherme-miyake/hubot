'use strict';
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _robot;
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("./types/datastore");
class User {
    constructor(id, options) {
        // @ts-ignore
        _robot.set(this, void 0);
        if (typeof id == 'string')
            this.id = id;
        if (typeof id == 'object' && options == undefined)
            options = id;
        this.name = (options === null || options === void 0 ? void 0 : options.name) ? options.name : id.toString();
        if (options) {
            if (options.robot) {
                __classPrivateFieldSet(this, _robot, options.robot);
            }
            for (let key in options) {
                if (['robot'].includes(key))
                    continue;
                this[key] = options[key];
            }
        }
    }
    get robot() {
        return __classPrivateFieldGet(this, _robot);
    }
    _getRobot() { return __classPrivateFieldGet(this, _robot); }
    get datastore() {
        var _a;
        if ((_a = this.robot) === null || _a === void 0 ? void 0 : _a.datastore)
            return this.robot.datastore;
        throw new datastore_1.DataStoreUnavailable('datastore is not initialized');
    }
    _constructKey(key) {
        return `${this.id}+${key}`;
    }
    set(key, value) {
        return this.datastore.set(this._constructKey(key), value, 'users');
    }
    get(key) {
        return this.datastore._get(this._constructKey(key), 'users');
    }
}
exports.default = User;
_robot = new WeakMap();
//# sourceMappingURL=user.js.map