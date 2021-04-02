'use strict'
import Robot from "../robot"
export default abstract class DataStore {
  robot: Robot
  // Represents a persistent, database-backed storage for the robot. Extend this.
  constructor(robot:any) {
    this.robot = robot
  }

  // Public: Set value for key in the database. Overwrites existing
  // values if present. Returns a promise which resolves when the
  // write has completed.
  //
  // Value can be any JSON-serializable type.
  set(key: string, value: string | object, table: string = 'global') {
    if (typeof value == 'string') return this._set(key, value, table)
    if (typeof value == 'object') return this._set(key, JSON.stringify(value), table)
  }

  // Public: Get value by key if in the database or return `undefined`
  // if not found. Returns a promise which resolves to the
  // requested value.
  async get(key:string, table: string = 'global') {
    let value = await this._get(key, table)
    try{
      // @ts-ignore
      return JSON.parse(value)
    }catch (error){
      return value

    }
  }

  // Public: Digs inside the object at `key` for a key named
  // `objectKey`. If `key` isn't already present, or if it doesn't
  // contain an `objectKey`, returns `undefined`.
  async getObject(key:string, objectKey:string) {
    let object = await this.get(key)
    // @ts-ignore
    return typeof object == 'object' && object.hasOwnProperty(objectKey) ? object[objectKey] : undefined
  }

  // Public: Assuming `key` represents an object in the database,
  // sets its `objectKey` to `value`. If `key` isn't already
  // present, it's instantiated as an empty object.
  setObject(key:string, objectKey:string, value:string) {
    return this.get(key).then((object) => {
      let target = object || {}
      target[objectKey] = value
      return this.set(key, target)
    })
  }

  // Public: Adds the supplied value(s) to the end of the existing
  // array in the database marked by `key`. If `key` isn't already
  // present, it's instantiated as an empty array.
  setArray(key:string, value:string) {
    return this.get(key).then((object:any) => {
      let target = object || []
      // Extend the array if the value is also an array, otherwise
      // push the single value on the end.
      if (Array.isArray(value) && Array.isArray(target)) {
        // @ts-ignore
        return this.set(key, target.push.apply(target, value))
      } else {
        return this.set(key, target.concat(value))
      }
    })
  }

  // Private: Implements the underlying `set` logic for the datastore.
  // This will be called by the public methods. This is one of two
  // methods that must be implemented by subclasses of this class.
  // `table` represents a unique namespace for this key, such as a
  // table in a SQL database.
  //
  // This returns a resolved promise when the `set` operation is
  // successful, and a rejected promise if the operation fails.
  abstract _set(key: string, value: string, table: string): Promise<void>


  // Private: Implements the underlying `get` logic for the datastore.
  // This will be called by the public methods. This is one of two
  // methods that must be implemented by subclasses of this class.
  // `table` represents a unique namespace for this key, such as a
  // table in a SQL database.
  //
  // This returns a resolved promise containing the fetched value on
  // success, and a rejected promise if the operation fails.
  abstract _get(key: string, table: string): Promise<any>
}

class DataStoreUnavailable extends Error {}

export {
  DataStore,
  DataStoreUnavailable
}
