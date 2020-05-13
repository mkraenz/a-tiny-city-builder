import { random } from "lodash";
import { Input, Physics, Scene } from "phaser";
import { BackgroundImage } from "../components/BackgroundImage";
import { Citizen } from "../components/Citizen";
import { Field } from "../components/entities/Field";
import { House1 } from "../components/entities/House1";
import { House2 } from "../components/entities/House2";
import { Windmill } from "../components/entities/Windmill";
import { ForestSpawner } from "../components/ForestSpawner";
import { Player } from "../components/Player";
import { Tree } from "../components/Tree";
import { EntityClass, House } from "../utils/Entity";
import { IBuildCosts } from "../utils/IBuildCosts";
import { IPoint } from "../utils/IPoint";
import { MaiSceneHud } from "./MainSceneHud";

export class MainScene extends Scene {
    public buildingTypes: EntityClass[] = [House1, House2, Field, Windmill];
    public placedBuilding: EntityClass = this.buildingTypes[0];
    private buildings: Array<Physics.Arcade.Sprite | Physics.Arcade.Image> = [];
    private player!: Player;
    private cits: Citizen[] = [];
    private trees: Tree[] = [];

    constructor() {
        super({ key: "MainScene" });
    }

    public create(): void {
        const bg = new BackgroundImage(this, "peach-bg");
        bg.on("pointerup", (pointer: Input.Pointer) =>
            this.placeBuilding(pointer)
        );
        this.player = new Player();
        new MaiSceneHud(this, this.player);
        const forest = new ForestSpawner(this);
        this.trees = forest.spawn(6);
        this.cits = Array(3)
            .fill(0)
            .map(
                _ =>
                    new Citizen(
                        this,
                        10,
                        10,
                        "woodcutter",
                        this.player,
                        randomEle(this.trees)
                    )
            );
    }

    public update() {
        this.trees = this.trees.filter(t => t.active);
        this.cits.forEach(citizen => {
            if (!citizen.target) {
                const tree = randomEle(this.trees);
                citizen.target = tree;
            }
            if (!citizen.home) {
                const freeHouseX = this.buildings
                    .filter(b => b instanceof House1 || b instanceof House2)
                    .filter(b => !(b as House).citizen)[0];
                const freeHouse = freeHouseX as House | undefined;
                if (freeHouse) {
                    citizen.home = freeHouse;
                    freeHouse.citizen = citizen;
                }
            }
        });
    }

    private placeBuilding({ x, y }: Input.Pointer) {
        const Building = this.placedBuilding;
        if (this.canBuildAt(x, y, Building) && this.canPayFor(Building)) {
            const house = new Building(this, { x, y });
            this.buildings.push(house);
            this.player.pay(Building.buildCosts);
        }
    }

    private canPayFor({ buildCosts }: { buildCosts: IBuildCosts }) {
        return this.player.hasResources(buildCosts);
    }

    /** assumes that buildings are placed with origin 0.5, 0.5 */
    private canBuildAt(
        x: number,
        y: number,
        building: { width: number; height: number }
    ) {
        const halfWidth = building.width / 2;
        const halfHeight = building.height / 2;
        const topLeft = { x: x - halfWidth, y: y - halfHeight };
        const topRight = { x: x + halfWidth, y: y - halfHeight };
        const bottomRight = { x: x + halfWidth, y: y + halfHeight };
        const bottomLeft = { x: x - halfWidth, y: y + halfHeight };
        return !this.buildings.some(({ body }) => {
            // TODO not working for windmill and house2
            const hit = (point: IPoint) => body.hitTest(point.x, point.y);
            return (
                hit(topLeft) ||
                hit(topRight) ||
                hit(bottomLeft) ||
                hit(bottomRight)
            );
        });
    }
}

const randomEle = <T>(arr: T[]) =>
    arr.length ? arr[random(arr.length - 1)] : undefined;
