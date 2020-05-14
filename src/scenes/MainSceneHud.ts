import { Scene } from "phaser";
import { Field } from "../components/entities/Field";
import { House1 } from "../components/entities/House1";
import { House2 } from "../components/entities/House2";
import { Windmill } from "../components/entities/Windmill";
import { Board } from "../components/hud/Board";
import { PostItWithImage } from "../components/hud/PostItWithImage";
import { WrittenPostit } from "../components/hud/WrittenPostit";
import { Player } from "../components/Player";
import { EntityClass } from "../utils/Entity";
import { atTopLeft } from "../utils/get-coords";
import { IResources } from "../utils/IResources";

export class MaiSceneHud {
    private buildingTypes: EntityClass[] = [House1, House2, Field, Windmill];
    private resources: Array<keyof IResources> = [
        "stone",
        "food",
        "crops",
        "wood",
    ];

    constructor(
        private scene: Scene & { placedBuilding: EntityClass },
        private player: Player
    ) {
        this.addGui();
    }

    private addGui() {
        this.addResources();
        this.addSelectBuildings();
    }

    private addResources() {
        const board = new Board(
            this.scene,
            this.scene.scale.width / 2,
            50,
            true
        );
        const xPostItOffset = 60;
        const boardTopLeft = atTopLeft(board);
        this.resources.forEach(
            (type, i) =>
                new PostItWithImage(
                    this.scene,

                    {
                        x: boardTopLeft.x + xPostItOffset * i + 20,
                        y: boardTopLeft.y + 12,
                    },
                    {
                        component: {
                            texture: type,
                            scale: 1.8,
                        },
                        onPointerup: () => undefined,
                    }
                )
        );
        this.resources.forEach(
            (type, i) =>
                new WrittenPostit(
                    this.scene,
                    boardTopLeft.x + xPostItOffset * i + 20 + 25,
                    boardTopLeft.y + 12 + 67,
                    () => this.player[type]
                )
        );
    }

    private addSelectBuildings() {
        const board = new Board(this.scene, 20, this.scene.scale.height - 100);
        const xPostItOffset = 60;
        this.buildingTypes.forEach(
            (Type, i) =>
                new PostItWithImage(
                    this.scene,
                    { x: board.x + xPostItOffset * i + 20, y: board.y + 8 },
                    {
                        component: {
                            texture: Type.texture,
                            scale: 1.8,
                        },
                        onPointerup: () => (this.scene.placedBuilding = Type),
                    }
                )
        );
    }
}
