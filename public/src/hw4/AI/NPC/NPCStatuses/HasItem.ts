import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Item from "../../../GameSystems/ItemSystem/Item";
import Finder from "../../../GameSystems/Searching/Finder";

import NPCActor from "../../../Actors/NPCActor";

export class HasItem extends GoapState {
    protected actor: NPCActor;
    protected finder: Finder<Item>;

    public constructor(actor: NPCActor, finder: Finder<Item>) {
        super()
        this.actor = actor;
        this.finder = finder;
    }

    public isSatisfied(): boolean {
        return this.finder.find(Array.from(this.actor.inventory.items())) !== null
    }
    
}