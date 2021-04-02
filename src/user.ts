'use strict'

import DataStore, {DataStoreUnavailable} from "./types/datastore";
import Robot  from "./robot"

export default class User {
  // Represents a participating user in the chat.
  //
  // id      - A unique ID for the user.
  // options - An optional Hash of key, value pairs for this user.
  id: string
  name: string
  // @ts-ignore
  #robot: Robot
  [key:string]: any

  constructor (id:string | object, options?:{[key:string] : any }) {
    if (typeof id == 'string') this.id = id
    if (typeof id == 'object' && options == undefined) options = id

    this.name = options?.name ? options.name : id.toString()

    if (options) {
      if (options.robot) {
        this.#robot = options.robot
      }

      for (let key in options) {
        if (['robot'].includes(key)) continue
        this[key] = options[key]
      }
    }
  }

  get robot() {
      return this.#robot
  }

  _getRobot(){return this.#robot}

  get datastore(): DataStore {
    if (this.robot?.datastore) return this.robot.datastore
    throw new DataStoreUnavailable('datastore is not initialized')
  }

  _constructKey (key:string) {
    return `${this.id}+${key}`
  }

  set (key:string, value: string|object) {
    return this.datastore.set(this._constructKey(key), value, 'users')
  }

  get (key:string) {
    return this.datastore._get(this._constructKey(key), 'users')
  }


}

