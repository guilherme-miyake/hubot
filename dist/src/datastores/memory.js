'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("../types/datastore");
class InMemoryDataStore extends datastore_1.DataStore {
    constructor(robot) {
        super(robot);
        this.data = {
            global: {},
            users: {}
        };
    }
    _get(key, table) {
        return Promise.resolve(this.data[table][key]);
    }
    _set(key, value, table) {
        return Promise.resolve(this.data[table][key] = value);
    }
}
exports.default = InMemoryDataStore;
module.exports = InMemoryDataStore;
//# sourceMappingURL=memory.js.map