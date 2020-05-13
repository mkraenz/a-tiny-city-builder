import { Input, Physics, Scene } from "phaser";
import { BackgroundImage } from "../components/BackgroundImage";
import { DebugMouse } from "../components/DebugMouse";
import { Field } from "../components/entities/Field";
import { House1 } from "../components/entities/House1";
import { House2 } from "../components/entities/House2";
import { Windmill } from "../components/entities/Windmill";
import { Board } from "../components/gui/Board";
import { PostItWithImage } from "../components/gui/PostItWithImage";
import { Color } from "../styles/Color";
import { EntityClass } from "../utils/Entity";
import { IPoint } from "../utils/IPoint";

export class MainScene extends Scene {
    public buildingTypes: EntityClass[] = [House1, House2, Field, Windmill];
    private buildings: Array<Physics.Arcade.Sprite | Physics.Arcade.Image> = [];
    private placedBuilding: EntityClass = this.buildingTypes[0];

    constructor() {
        super({ key: "MainScene" });
    }

    public create(): void {
        this.cameras.add(0, 0).setBackgroundColor(Color.Peach);

        const bg = new BackgroundImage(this, "peach-bg");
        bg.on("pointerup", pointer => this.placeBuilding(pointer));
        new DebugMouse(this);
        this.addGui();
    }

    private addGui() {
        const board = new Board(this, 20, this.scale.height - 100);
        const xOffset = 60;
        this.buildingTypes.forEach(
            (Type, i) =>
                new PostItWithImage(
                    this,
                    { x: board.x + xOffset * i + 20, y: board.y + 8 },
                    {
                        component: {
                            texture: Type.texture,
                            scale: 1.8,
                        },
                        onPointerup: () => (this.placedBuilding = Type),
                    }
                )
        );
    }

    private placeBuilding({ x, y }: Input.Pointer) {
        const Building = this.placedBuilding;
        if (this.canBuild(x, y, Building)) {
            const house = new Building(this, { x, y });
            this.buildings.push(house);
        }
    }

    /** assumes that buildings are placed with origin 0.5, 0.5 */
    private canBuild(
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
