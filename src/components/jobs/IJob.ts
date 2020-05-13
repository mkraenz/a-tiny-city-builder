import { Sprite } from "../../utils/Sprite";
import { Optional } from "../../utils/ts";

export interface IJob {
    update: () => void;
    getNextTarget: () => Optional<Sprite>;
}
