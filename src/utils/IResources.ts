export interface IResources {
    food: number;
    stone: number;
    wood: number;
    crops: number;
}

export interface IStore {
    addResources: (res: Partial<IResources>) => void;
}
