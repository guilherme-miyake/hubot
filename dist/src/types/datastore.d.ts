import Robot from "../robot";
export default abstract class DataStore {
    robot: Robot;
    constructor(robot: any);
    set(key: string, value: string | object, table?: string): Promise<void>;
    get(key: string, table?: string): Promise<any>;
    getObject(key: string, objectKey: string): Promise<any>;
    setObject(key: string, objectKey: string, value: string): Promise<void>;
    setArray(key: string, value: string): Promise<void>;
    abstract _set(key: string, value: string, table: string): Promise<void>;
    abstract _get(key: string, table: string): Promise<any>;
}
declare class DataStoreUnavailable extends Error {
}
export { DataStore, DataStoreUnavailable };
//# sourceMappingURL=datastore.d.ts.map