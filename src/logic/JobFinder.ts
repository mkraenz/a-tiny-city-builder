import { Citizen } from "../components/Citizen";
import { Field } from "../components/entities/Field";
import { Farmer } from "../components/jobs/Farmer";
import { Hobo } from "../components/jobs/Hobo";
import { Woodcutter } from "../components/jobs/Woodcutter";
import { Tree } from "../components/Tree";
import { IStore } from "../utils/IResources";

interface IJobCounts {
    woodcutter: number;
    farmer: number;
}

export class JobFinder {
    private targetJobCount: IJobCounts = {
        woodcutter: 2,
        farmer: 5,
    };

    constructor(
        private store: IStore,
        private cits: () => Citizen[],
        private trees: () => Tree[],
        private fields: () => Field[]
    ) {}

    public assignJobsToUnemployed() {
        const unemployed = this.getUnemployedCitizen();
        unemployed.forEach(cit => {
            if (
                this.currentJobCount.farmer < this.targetJobCount.farmer &&
                this.fields().find(f => !f.isTaken)
            ) {
                this.makeFarmer(cit);
                return;
            }
            if (
                this.currentJobCount.woodcutter < this.targetJobCount.woodcutter
            ) {
                this.makeWoodcutter(cit);
                return;
            }
        });
    }

    private makeFarmer(cit: Citizen) {
        const freeField = this.fields().find(f => !f.isTaken);
        if (freeField) {
            const job = new Farmer(cit, this.store, () => freeField);
            cit.setJob(job);
            freeField.isTaken = true;
        }
    }

    private makeWoodcutter(cit: Citizen) {
        const job = new Woodcutter(cit, this.store, this.trees);
        cit.setJob(job);
    }

    private getUnemployedCitizen() {
        return this.cits().filter(c => c.job instanceof Hobo);
    }

    public get currentJobCount(): IJobCounts {
        return {
            farmer: this.farmers.length,
            woodcutter: this.woodcutters.length,
        };
    }

    private get woodcutters() {
        return this.cits().filter(c => c.job instanceof Woodcutter);
    }

    private get farmers() {
        return this.cits().filter(c => c.job instanceof Farmer);
    }
}
