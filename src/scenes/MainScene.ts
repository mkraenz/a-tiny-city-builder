import { Input, Physics, Scene } from "phaser";
import { BackgroundImage } from "../components/BackgroundImage";
import { Citizen } from "../components/Citizen";
import { Field } from "../components/entities/Field";
import { House1 } from "../components/entities/House1";
import { House2 } from "../components/entities/House2";
import { Windmill } from "../components/entities/Windmill";
import { Player } from "../components/Player";
import { Tree } from "../components/Tree";
import { TreeSpawner } from "../components/TreeSpawner";
import { HomeFinder } from "../logic/HomeFinder";
import { JobFinder } from "../logic/JobFinder";
import { Entity, EntityClass, House } from "../utils/Entity";
import { IBuildCosts } from "../utils/IBuildCosts";
import { IPoint } from "../utils/IPoint";
import { MaiSceneHud } from "./MainSceneHud";

const START_CITIZEN_COUNT = 1;
const START_TREE_COUNT = 800;
const NEW_TREES_PER_SEC = 2;

export class MainScene extends Scene {
    public buildingTypes: EntityClass[] = [House1, House2, Field, Windmill];
    public placedBuilding: EntityClass = this.buildingTypes[0];
    private buildings: Array<Physics.Arcade.Sprite | Physics.Arcade.Image> = [];
    private player!: Player;
    private cits: Citizen[] = [];
    private trees: Tree[] = [];
    private homeFinder!: HomeFinder;
    private jobFinder!: JobFinder;

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
        const forest = new TreeSpawner(this, this.trees);
        forest.spawn(5);
        forest.spawnRegularly(NEW_TREES_PER_SEC);

        this.cits = Array(START_CITIZEN_COUNT)
            .fill(0)
            .map(_ => new Citizen(this, 10, 10));
        const getCits = () => this.cits;
        this.homeFinder = new HomeFinder(
            () => this.buildings.filter(isHouse),
            getCits
        );
        this.jobFinder = new JobFinder(
            this.player,
            getCits,
            () => this.trees,
            () => this.buildings.filter(isField),
            () => this.buildings.filter(isWindmill)
        );
    }

    public update() {
        this.homeFinder.assignFreeHomes();
        this.jobFinder.assignJobsToUnemployed();
    }

    public addCits(newCits: Citizen[]) {
        this.cits.push(...newCits);
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

const isHouse = (b: Entity): b is House =>
    b instanceof House1 || b instanceof House2;
const isField = (b: Entity): b is Field => b instanceof Field;
const isWindmill = (b: Entity): b is Windmill => b instanceof Windmill;
