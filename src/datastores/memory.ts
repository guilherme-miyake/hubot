'use strict'

import Robot from "../robot";

import {DataStore} from "../types/datastore";

export default class InMemoryDataStore extends DataStore {
  data:any

  constructor (robot:Robot) {
    super(robot)
    this.data = {
      global: {},
      users: {}
    }
  }

  _get (key:string, table:string) {
    return Promise.resolve(this.data[table][key])
  }

  _set (key:string, value:string, table:string): any {
    return Promise.resolve(this.data[table][key] = value)
  }
}

module.exports = InMemoryDataStore
