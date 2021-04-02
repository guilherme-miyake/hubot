import Robot from "../../src/robot";
import Adapter from "../../src/types/adapter";
export declare class MockAdapter extends Adapter {
    constructor(robot: Robot);
    send(envelope: any, ...strings: any[]): void;
    reply(envelope: any, ...strings: any[]): void;
    topic(envelope: any, ...strings: any[]): void;
    play(envelope: any, ...strings: any[]): void;
    run(): void;
    close(): void;
}
export declare const use: (robot: any) => MockAdapter;
//# sourceMappingURL=mock-adapter.d.ts.map