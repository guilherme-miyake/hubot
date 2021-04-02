'use strict'

import User from "./src/user";
import Brain from "./src/brain";
import Robot from "./src/robot";
import Adapter from "./src/types/adapter";
import Response from "./src/response";
import Listener, {TextListener} from "./src/listener";
import Message, {CatchAllMessage, EnterMessage, LeaveMessage, TextMessage, TopicMessage} from "./src/message";
import DataStore, {DataStoreUnavailable} from "./src/types/datastore";

export default {
  User,
  Brain,
  Robot,
  Adapter,
  Response,
  Listener,
  TextListener,
  Message,
  TextMessage,
  EnterMessage,
  LeaveMessage,
  TopicMessage,
  CatchAllMessage,
  DataStore,
  DataStoreUnavailable,

  loadBot(adapterPath:any, adapterName:any, enableHttpd:any, botName:any, botAlias:any) {
    return new Robot(adapterPath, adapterName, enableHttpd, botName, botAlias)
  }
}
