'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./src/user"));
const brain_1 = __importDefault(require("./src/brain"));
const robot_1 = __importDefault(require("./src/robot"));
const adapter_1 = __importDefault(require("./src/types/adapter"));
const response_1 = __importDefault(require("./src/response"));
const listener_1 = __importStar(require("./src/listener"));
const message_1 = __importStar(require("./src/message"));
const datastore_1 = __importStar(require("./src/types/datastore"));
exports.default = {
    User: user_1.default,
    Brain: brain_1.default,
    Robot: robot_1.default,
    Adapter: adapter_1.default,
    Response: response_1.default,
    Listener: listener_1.default,
    TextListener: listener_1.TextListener,
    Message: message_1.default,
    TextMessage: message_1.TextMessage,
    EnterMessage: message_1.EnterMessage,
    LeaveMessage: message_1.LeaveMessage,
    TopicMessage: message_1.TopicMessage,
    CatchAllMessage: message_1.CatchAllMessage,
    DataStore: datastore_1.default,
    DataStoreUnavailable: datastore_1.DataStoreUnavailable,
    loadBot(adapterPath, adapterName, enableHttpd, botName, botAlias) {
        return new robot_1.default(adapterPath, adapterName, enableHttpd, botName, botAlias);
    }
};
//# sourceMappingURL=es2015.js.map