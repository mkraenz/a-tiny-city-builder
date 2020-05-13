import { Physics, Scene } from "phaser";
import { Sprite } from "../utils/Sprite";
import { House1 } from "./entities/House1";
import { House2 } from "./entities/House2";
import { Player } from "./Player";

const MIN_DISTANCE_TO_TARGET = 5;
const SPEED = 200; // px per frame

type Job = "woodcutter" | "farmer" | "miner";

export class Citizen extends Physics.Arcade.Sprite {
    private idle = true;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        public job: Job,
        private player: Player,
        public target?: Sprite,
        public home?: House1 | House2
    ) {
        super(scene, x, y, "citizen");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.blocked = {
            none: true,
            down: false,
            left: false,
            right: false,
            up: false,
        };
    }

    public move(to: Sprite) {
        const Vector = Phaser.Math.Vector2;
        const location = new Vector(this.x, this.y);
        const goal = new Vector(to.x, to.y);
        const direction = goal
            .add(location.negate())
            .normalize()
            .scale(SPEED);
        this.setVelocity(direction.x, direction.y);
    }

    public preUpdate() {
        if (!this.target) {
            if (this.home) {
                this.move(this.home);
            }
            return;
        }
        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.target.x,
            this.target.y
        );

        if (dist > MIN_DISTANCE_TO_TARGET) {
            this.move(this.target);
        } else {
            this.setVelocity(0);
            if (this.job === "woodcutter" && this.idle) {
                this.cutTree();
            }
        }
    }

    private cutTree() {
        this.idle = false;
        setTimeout(() => {
            if (!this.target) {
                throw new Error(
                    `citizen target not set. This should not have happened. Citizen: ${JSON.stringify(
                        this,
                        null,
                        2
                    )}`
                );
            }
            this.player.addResources({ wood: 5 });
            this.target.destroy();
            this.idle = true;
            this.target = undefined;
        }, 2000);
    }
}
