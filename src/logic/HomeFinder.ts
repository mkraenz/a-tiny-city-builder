import { Citizen } from "../components/Citizen";
import { House } from "../utils/Entity";

export class HomeFinder {
    constructor(private homes: () => House[], private cits: () => Citizen[]) {}

    public assignFreeHomes() {
        const homeless = this.cits().filter(c => !c.home);
        homeless.forEach(cit => {
            const freeHome = this.getFreeHomes()[0];
            if (freeHome) {
                cit.home = freeHome;
                freeHome.citizen = cit;
            }
        });
    }

    private getFreeHomes() {
        return this.homes().filter(h => !h.citizen);
    }
}

//         const freeHouseX = this.buildings
//             .filter(b => b instanceof House1 || b instanceof House2)
//             .filter(b => !(b as House).citizen)[0];
//         const freeHouse = freeHouseX as House | undefined;
//         if (freeHouse) {
//             cit.home = freeHouse;
//             freeHouse.citizen = cit;
//         }
