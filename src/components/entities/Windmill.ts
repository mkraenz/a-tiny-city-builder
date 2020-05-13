import { Physics, Scene } from "phaser";
import { IPoint } from "../../utils/IPoint";

export class Windmill extends Physics.Arcade.Image {
    public static width = 24;
    public static height = 32;
    public static readonly texture = "windmill";

    constructor(scene: Scene, at: IPoint) {
        super(scene, at.x, at.y, Windmill.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}
