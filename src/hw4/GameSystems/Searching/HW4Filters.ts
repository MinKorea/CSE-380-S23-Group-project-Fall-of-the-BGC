import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import Battler from "../BattleSystem/Battler";
import Item from "../ItemSystem/Item";
import { TargetableEntity } from "../Targeting/TargetableEntity";

export function BattlerActiveFilter(): (b: Battler) => boolean {
    return (b: Battler) => b.battlerActive;
}

export function BattlerHealthFilter(min: number, max: number): (b: Battler) => boolean {
    return (b: Battler) => { return MathUtils.between(min, max, b.health, true); }
}

export function BattlerGroupFilter(groups: number[], whitelist: boolean = true): (b: Battler) => boolean {
    return whitelist ? (b: Battler) => { return groups.includes(b.battleGroup); } : (b: Battler) => { return !groups.includes(b.battleGroup); }
}

export function AllyFilter(battler: Battler): (other: Battler) => boolean {
    return (other: Battler) => { return battler.battleGroup === other.battleGroup; }
}

export function EnemyFilter(battler: Battler): (other: Battler) => boolean {
    return (other: Battler) => { return battler.battleGroup !== other.battleGroup; }
}

export function RangeFilter(positioned: Positioned, minDistSq: number, maxDistSq: number): (t: TargetableEntity) => boolean {
    return (t: TargetableEntity) => { 
        let distSq = t.position.distanceSqTo(positioned.position)
        return distSq > minDistSq && distSq < maxDistSq;
    }
}

export function ItemFilter(constr: new (...args: any[]) => Item): (i: Item) => boolean {
    return (i: Item) => { return i.constructor === constr; }
}

export function VisibleItemFilter(): (i: Item) => boolean {
    return (i: Item) => i.visible;
}