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

    private getNextTarget() {
        const freeTrees = this.getTrees().filter(t => !t.isTaken);
        if (!freeTrees.length) {
            return undefined;
        }
        const nearestTree = freeTrees.reduce(
            (min, val) =>
                this.citizen.dist(val) > this.citizen.dist(min) ? min : val,
            freeTrees[0]
        );
        return nearestTree;
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
