import User from "./src/user";
import Brain from "./src/brain";
import Robot from "./src/robot";
import Adapter from "./src/types/adapter";
import Response from "./src/response";
import Listener, { TextListener } from "./src/listener";
import Message, { CatchAllMessage, EnterMessage, LeaveMessage, TextMessage, TopicMessage } from "./src/message";
import DataStore, { DataStoreUnavailable } from "./src/types/datastore";
declare const _default: {
    User: typeof User;
    Brain: typeof Brain;
    Robot: typeof Robot;
    Adapter: typeof Adapter;
    Response: typeof Response;
    Listener: typeof Listener;
    TextListener: typeof TextListener;
    Message: typeof Message;
    TextMessage: typeof TextMessage;
    EnterMessage: typeof EnterMessage;
    LeaveMessage: typeof LeaveMessage;
    TopicMessage: typeof TopicMessage;
    CatchAllMessage: typeof CatchAllMessage;
    DataStore: typeof DataStore;
    DataStoreUnavailable: typeof DataStoreUnavailable;
    loadBot(adapterPath: any, adapterName: any, enableHttpd: any, botName: any, botAlias: any): Robot;
};
export default _default;
//# sourceMappingURL=es2015.d.ts.map