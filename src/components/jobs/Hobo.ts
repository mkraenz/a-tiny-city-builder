import { IJob } from "./IJob";

export class Hobo implements IJob {
    public update() {
        // being idle
    }

    public stop() {
        // was idle all along
    }
}
