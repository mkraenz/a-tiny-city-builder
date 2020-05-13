import { Physics, Scene } from "phaser";
import { IPoint } from "../../utils/IPoint";

export class Field extends Physics.Arcade.Image {
    public static width = 32;
    public static height = 32;
    public static readonly texture = "field";

    constructor(scene: Scene, at: IPoint) {
        super(scene, at.x, at.y, Field.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}
