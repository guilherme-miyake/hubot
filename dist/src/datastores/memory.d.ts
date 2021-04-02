import Robot from "../robot";
import { DataStore } from "../types/datastore";
export default class InMemoryDataStore extends DataStore {
    data: any;
    constructor(robot: Robot);
    _get(key: string, table: string): Promise<any>;
    _set(key: string, value: string, table: string): any;
}
//# sourceMappingURL=memory.d.ts.map