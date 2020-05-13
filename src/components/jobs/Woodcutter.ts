import { randomEle } from "../../utils/array-utils";
import { IStore } from "../../utils/IResources";
import { Citizen } from "../Citizen";
import { Tree } from "../Tree";
import { IJob } from "./IJob";

export class Woodcutter implements IJob {
    private isCuttingTree = false;

    constructor(
        private citizen: Citizen,
        private store: IStore,
        private getTrees: () => Tree[]
    ) {}

    public getNextTarget() {
        return randomEle(this.getTrees().filter(t => !t.isTaken));
    }

    public update() {
        if (this.citizen.idle) {
            this.startWork();
        }
        if (
            !this.citizen.idle &&
            this.citizen.isCloseToTarget() &&
            !this.isCuttingTree
        ) {
            this.cutTree();
        }
    }

    private startWork() {
        const tree = this.getNextTarget();
        if (tree) {
            this.citizen.setTarget(tree);
            tree.isTaken = true;
            this.citizen.setIdle(false);
        } else {
            this.citizen.setIdle(true);
        }
    }

    private cutTree() {
        this.citizen.setIdle(false);
        this.isCuttingTree = true;
        setTimeout(() => {
            if (!this.citizen.target) {
                throw new Error(
                    `Citizen.target not set. This should not have happened. Should have been a Tree. Citizen: ${JSON.stringify(
                        this,
                        null,
                        2
                    )}`
                );
            }
            this.store.addResources({ wood: 5 });
            this.citizen.target.destroy();
            this.citizen.setIdle(true);
            this.citizen.setTarget(undefined);
            this.isCuttingTree = false;
        }, 2000);
    }
}
