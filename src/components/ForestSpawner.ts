import { Scene } from "phaser";
import { Tree } from "./Tree";

export class ForestSpawner {
    constructor(private scene: Scene) {}

    public spawn(n: number) {
        return Array(n)
            .fill(0)
            .map(_ => new Tree(this.scene, { x: 0, y: 0 }).setRandomPosition());
    }
}
