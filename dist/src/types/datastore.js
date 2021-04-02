'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStoreUnavailable = exports.DataStore = void 0;
class DataStore {
    // Represents a persistent, database-backed storage for the robot. Extend this.
    constructor(robot) {
        this.robot = robot;
    }
    // Public: Set value for key in the database. Overwrites existing
    // values if present. Returns a promise which resolves when the
    // write has completed.
    //
    // Value can be any JSON-serializable type.
    set(key, value, table = 'global') {
        if (typeof value == 'string')
            return this._set(key, value, table);
        if (typeof value == 'object')
            return this._set(key, JSON.stringify(value), table);
    }
    // Public: Get value by key if in the database or return `undefined`
    // if not found. Returns a promise which resolves to the
    // requested value.
    get(key, table = 'global') {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield this._get(key, table);
            try {
                // @ts-ignore
                return JSON.parse(value);
            }
            catch (error) {
                return value;
            }
        });
    }
    // Public: Digs inside the object at `key` for a key named
    // `objectKey`. If `key` isn't already present, or if it doesn't
    // contain an `objectKey`, returns `undefined`.
    getObject(key, objectKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let object = yield this.get(key);
            // @ts-ignore
            return typeof object == 'object' && object.hasOwnProperty(objectKey) ? object[objectKey] : undefined;
        });
    }
    // Public: Assuming `key` represents an object in the database,
    // sets its `objectKey` to `value`. If `key` isn't already
    // present, it's instantiated as an empty object.
    setObject(key, objectKey, value) {
        return this.get(key).then((object) => {
            let target = object || {};
            target[objectKey] = value;
            return this.set(key, target);
        });
    }
    // Public: Adds the supplied value(s) to the end of the existing
    // array in the database marked by `key`. If `key` isn't already
    // present, it's instantiated as an empty array.
    setArray(key, value) {
        return this.get(key).then((object) => {
            let target = object || [];
            // Extend the array if the value is also an array, otherwise
            // push the single value on the end.
            if (Array.isArray(value) && Array.isArray(target)) {
                // @ts-ignore
                return this.set(key, target.push.apply(target, value));
            }
            else {
                return this.set(key, target.concat(value));
            }
        });
    }
}
exports.default = DataStore;
exports.DataStore = DataStore;
class DataStoreUnavailable extends Error {
}
exports.DataStoreUnavailable = DataStoreUnavailable;
//# sourceMappingURL=datastore.js.map