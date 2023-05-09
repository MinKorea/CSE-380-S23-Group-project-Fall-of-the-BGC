import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { TargetableEntity } from "./TargetableEntity";
import { TargetingEntity } from "./TargetingEntity";


export default class BasicTargetable implements TargetableEntity {
    protected owner: Positioned;

    protected targeting: Map<number, TargetingEntity>;

    constructor(owner: Positioned) {
        this.owner = owner;
        this.targeting = new Map<number, TargetingEntity>();
    }

    public getTargeting(): TargetingEntity[] { 
        return Array.from(this.targeting.values()); 
    }

    public addTargeting(targeting: TargetingEntity): void {
        this.targeting.set(targeting.id, targeting);
    }
    
    public removeTargeting(targeting: TargetingEntity): void {
        this.targeting.delete(targeting.id);
    }

    get position(): Vec2 { return this.owner.position; }
    get relativePosition(): Vec2 { return this.owner.relativePosition; }

}