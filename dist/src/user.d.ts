import DataStore from "./types/datastore";
import Robot from "./robot";
export default class User {
    #private;
    id: string;
    name: string;
    [key: string]: any;
    constructor(id: string | object, options?: {
        [key: string]: any;
    });
    get robot(): Robot;
    _getRobot(): Robot;
    get datastore(): DataStore;
    _constructKey(key: string): string;
    set(key: string, value: string | object): Promise<void>;
    get(key: string): Promise<any>;
}
//# sourceMappingURL=user.d.ts.map