import { Citizen } from "../components/Citizen";
import { Field } from "../components/entities/Field";
import { Windmill } from "../components/entities/Windmill";
import { Farmer } from "../components/jobs/Farmer";
import { Hobo } from "../components/jobs/Hobo";
import { Miller } from "../components/jobs/Miller";
import { Woodcutter } from "../components/jobs/Woodcutter";
import { Tree } from "../components/Tree";
import { IStore } from "../utils/IResources";

interface IJobCounts {
    woodcutter: number;
    farmer: number;
    miller: number;
}

export class JobFinder {
    private targetJobCount: IJobCounts = {
        woodcutter: 2,
        farmer: 5,
        miller: 2,
    };

    constructor(
        private store: IStore,
        private cits: () => Citizen[],
        private trees: () => Tree[],
        private fields: () => Field[],
        private windmills: () => Windmill[]
    ) {}

    public assignJobsToUnemployed() {
        const unemployed = this.getUnemployedCitizen();
        unemployed.forEach(cit => {
            if (
                this.currentJobCount.farmer < this.targetJobCount.farmer &&
                hasFree(this.fields())
            ) {
                this.makeFarmer(cit);
                return;
            }
            if (
                this.currentJobCount.miller < this.targetJobCount.miller &&
                hasFree(this.windmills())
            ) {
                this.makeMiller(cit);
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

    private makeMiller(cit: Citizen) {
        const freeBuilding = this.windmills().find(w => !w.isTaken);
        if (freeBuilding) {
            const job = new Miller(cit, this.store, () => freeBuilding);
            cit.setJob(job);
            freeBuilding.isTaken = true;
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
            miller: this.millers.length,
        };
    }

    private get woodcutters() {
        return this.cits().filter(c => c.job instanceof Woodcutter);
    }

    private get farmers() {
        return this.cits().filter(c => c.job instanceof Farmer);
    }

    private get millers() {
        return this.cits().filter(c => c.job instanceof Miller);
    }
}

const hasFree = (places: Array<{ isTaken: boolean }>) =>
    places.find(p => !p.isTaken);
