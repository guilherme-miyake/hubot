/// <reference types="node" />
import { EventEmitter } from 'events';
import Timeout = NodeJS.Timeout;
import Robot from "./robot";
export default class Brain extends EventEmitter {
    data: any;
    getRobot: () => any;
    autoSave: boolean;
    saveInterval: Timeout | undefined;
    constructor(robot: Robot);
    set(key: string, value: any): this;
    get(key: string): any;
    remove(key: string): this;
    save(): void;
    close(): void;
    setAutoSave(enabled: boolean): void;
    resetSaveInterval(seconds: number): void;
    mergeData(data: any): void;
    users(): any;
    userForId(id: string, options: any): any;
    userForName(name: string): any;
    usersForRawFuzzyName(fuzzyName: string): any[];
    usersForFuzzyName(fuzzyName: string): any[];
}
//# sourceMappingURL=brain.d.ts.map