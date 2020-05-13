import { IJob } from "./IJob";

export class Hobo implements IJob {
    public getNextTarget() {
        return undefined;
    }

    public update() {
        // being idle
    }
}
