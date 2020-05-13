import { Citizen } from "../components/Citizen";
import { Hobo } from "../components/jobs/Hobo";
import { Woodcutter } from "../components/jobs/Woodcutter";
import { Tree } from "../components/Tree";
import { IStore } from "../utils/IResources";

export class JobFinder {
    constructor(
        private store: IStore,
        private cits: () => Citizen[],
        private trees: () => Tree[]
    ) {}

    public assignJobsToUnemployed() {
        const unemployed = this.getUnemployedCitizen();
        unemployed.forEach(cit => {
            const job = new Woodcutter(cit, this.store, this.trees);
            cit.setJob(job);
        });
    }

    private getUnemployedCitizen() {
        return this.cits().filter(c => c.job instanceof Hobo);
    }
}
