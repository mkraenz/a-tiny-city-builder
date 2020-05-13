import { IResources } from "../utils/IResources";

export class Player {
    public food = 12;
    public stone = 5;
    public wood = 20;
    public crops = 20;

    public hasResources(res: Partial<IResources>) {
        const has = (key: keyof typeof res) =>
            res[key] ? res[key] <= this[key] : true;
        return has("food") && has("crops") && has("stone") && has("wood");
    }

    public addResources(res: Partial<IResources>) {
        Object.keys(res).forEach(key => (this[key] += res[key]));
    }

    public pay(res: Partial<IResources>) {
        Object.keys(res).forEach(key => (this[key] -= res[key]));
    }

    public print() {
        // tslint:disable-next-line: no-console
        console.log("player", this);
    }
}
