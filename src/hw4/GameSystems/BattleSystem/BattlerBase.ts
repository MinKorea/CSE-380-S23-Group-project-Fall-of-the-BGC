import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Region from "../../../Wolfie2D/DataTypes/Interfaces/Region";
import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import BasicTargetable from "../Targeting/BasicTargetable";
import { TargetableEntity } from "../Targeting/TargetableEntity";
import { TargetingEntity } from "../Targeting/TargetingEntity";

export default class BattlerBase implements Positioned, TargetableEntity {

    protected _region: Region & Positioned & Unique;
    protected _targetable: TargetableEntity;
    protected _battleGroup: number;

    public constructor(region: Region & Positioned & Unique) {
        this._region = region;
        this._targetable = new BasicTargetable(this._region);
        this._battleGroup = -1;
    }

    getTargeting(): TargetingEntity[] {
        return this._targetable.getTargeting();
    }
    addTargeting(targeting: TargetingEntity): void {
        this._targetable.addTargeting(targeting);
    }
    removeTargeting(targeting: TargetingEntity): void {
        this._targetable.removeTargeting(targeting);
    }

    get id(): number { return this._region.id; }
    
    relativePosition: Vec2;

    get position(): Vec2 { return this._region.position; }
    get region(): Region { return this._region; }

    get battleGroup(): number { return this._battleGroup; }
    set battleGroup(value: number) { this._battleGroup = value; }

}