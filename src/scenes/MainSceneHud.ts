import { Scene } from "phaser";
import { Field } from "../components/entities/Field";
import { House1 } from "../components/entities/House1";
import { House2 } from "../components/entities/House2";
import { Windmill } from "../components/entities/Windmill";
import { Board } from "../components/hud/Board";
import { PlusMinusButton } from "../components/hud/PlusMinusButton";
import { PostItWithImage } from "../components/hud/PostItWithImage";
import { TextDisplay } from "../components/hud/TextDisplay";
import { WrittenPostit } from "../components/hud/WrittenPostit";
import { Player } from "../components/Player";
import { CitizenManager } from "../logic/CitizenManager";
import { JobFinder } from "../logic/JobFinder";
import { Color, toHex } from "../styles/Color";
import { GUI_DEPTH } from "../styles/constants";
import { EntityClass } from "../utils/Entity";
import { atTopLeft } from "../utils/get-coords";
import { IJobCounts } from "../utils/IJobCounts";
import { IResources } from "../utils/IResources";

export class MaiSceneHud {
    private buildingTypes: EntityClass[] = [House1, House2, Field, Windmill];
    private resources: Array<keyof IResources> = [
        "stone",
        "food",
        "crops",
        "wood",
    ];
    private jobs: Array<keyof IJobCounts> = ["farmer", "miller", "woodcutter"];

    constructor(
        private scene: Scene & { placedBuilding: EntityClass },
        private player: Player,
        private jobManager: JobFinder,
        private citizenManager: CitizenManager
    ) {
        this.addGui();
    }

    private addGui() {
        this.addResources();
        this.addSelectBuildings();
        this.addJobAssignments();
    }

    private addJobAssignments() {
        const height = 200;
        const x = this.scene.scale.width / 2 + 150;
        const y = this.scene.scale.height / 2 - height / 2;
        this.scene.add
            .rectangle(x - 10, y - 10, 320, height, toHex(Color.Brown))
            .setOrigin(0, 0)
            .setInteractive();

        new TextDisplay(
            this.scene,
            x + 20,
            y,
            () => this.jobManager.totalTargetJobCount,
            true
        );
        this.scene.add.text(x + 20, y, "/").setDepth(GUI_DEPTH + 1);
        new TextDisplay(
            this.scene,
            x + 20 + 10,
            y,
            () => this.citizenManager.citizenCount
        );

        const y2 = y + 50;
        this.jobs.forEach((job, i) => {
            const yOffset = 30;
            this.scene.add
                .text(x, y2 + i * yOffset, job)
                .setDepth(GUI_DEPTH + 1);
            new PlusMinusButton(
                this.scene,
                x + 130,
                y2 + i * yOffset,
                "plus",
                () => this.jobManager.increaseTargetJobCount(job),
                () =>
                    this.jobManager.unemployedCitizen.length === 0 ||
                    this.jobManager.totalTargetJobCount ===
                        this.citizenManager.citizenCount
            );
            new PlusMinusButton(
                this.scene,
                x + 160,
                y2 + i * yOffset,
                "minus",
                () => this.jobManager.decreaseTargetJobCount(job),
                () => this.jobManager.getTargetJobCount(job) === 0
            );

            new TextDisplay(
                this.scene,
                x + 210,
                y2 + i * yOffset,
                () => this.jobManager.getCurrentJobCount(job),
                true
            );
            this.scene.add
                .text(x + 210, y2 + i * yOffset, "/")
                .setDepth(GUI_DEPTH + 1);
            new TextDisplay(this.scene, x + 220, y2 + i * yOffset, () =>
                this.jobManager.getTargetJobCount(job)
            );
        });
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
