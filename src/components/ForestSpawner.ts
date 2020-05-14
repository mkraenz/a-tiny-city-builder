import { Scene } from "phaser";
import { Tree } from "./Tree";

export class ForestSpawner {
    constructor(private scene: Scene, private trees: Tree[]) {}

    public spawn(n: number) {
        const spawned = Array(n)
            .fill(0)
            .map(_ => new Tree(this.scene, { x: 0, y: 0 }).setRandomPosition());
        this.trees.push(...spawned);
    }

    public spawnRegularly(spawnsPerSec: number) {
        setInterval(() => this.spawn(spawnsPerSec), 1000);
    }
}
