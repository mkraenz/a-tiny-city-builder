import { Physics, Scene } from "phaser";
import { IBuildCosts } from "../../utils/IBuildCosts";
import { IPoint } from "../../utils/IPoint";

export class House2 extends Physics.Arcade.Image {
    public static width = 24;
    public static height = 32;
    public static readonly texture = "house2";
    public static buildCosts: IBuildCosts = {
        stone: 2,
        wood: 4,
    };
    public citizen?: {};

    constructor(scene: Scene, at: IPoint) {
        super(scene, at.x, at.y, House2.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}
