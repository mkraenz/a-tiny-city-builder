import { IStore } from "../../utils/IResources";
import { Citizen } from "../Citizen";
import { Field } from "../entities/Field";
import { IJob } from "./IJob";

const CROPS_PER_TICK = 1;
const TIME_TO_FARM = 5000;

export class Farmer implements IJob {
    private isFarming = false;

    constructor(
        private citizen: Citizen,
        private store: IStore,
        private field: () => Field
    ) {}

    public update() {
        if (this.citizen.idle) {
            this.startWork();
        }
        if (
            !this.citizen.idle &&
            this.citizen.isCloseToTarget() &&
            !this.isFarming
        ) {
            this.startFarming();
        }
    }

    private getNextTarget() {
        return this.field() || undefined;
    }

    private startWork() {
        const target = this.getNextTarget();
        if (target) {
            this.citizen.setTarget(target);
            this.citizen.setIdle(false);
        } else {
            this.citizen.setIdle(true);
        }
    }

    private startFarming() {
        this.citizen.setIdle(false);
        this.isFarming = true;
        setTimeout(() => this.onFarmingFinished(), TIME_TO_FARM);
    }

    private onFarmingFinished() {
        if (!this.citizen.target) {
            throw new Error(
                `Citizen.target not set. This should not have happened. Should have been a Tree. Citizen: ${JSON.stringify(
                    this,
                    null,
                    2
                )}`
            );
        }
        this.store.addResources({ crops: CROPS_PER_TICK });
        this.citizen.setIdle(true);
        this.citizen.setTarget(undefined);
        this.isFarming = false;
    }
}
