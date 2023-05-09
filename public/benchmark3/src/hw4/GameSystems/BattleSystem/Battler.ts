import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Inventory from "../ItemSystem/Inventory";
import { TargetableEntity } from "../Targeting/TargetableEntity";

/**
 * An interface for a Battler
 */
export default interface Battler extends TargetableEntity, Unique {

    /** The Battlers group number */
    get battleGroup(): number;
    set battleGroup(value: number);

    /** The maximum health of the battler */
    get maxHealth(): number;
    set maxHealth(value: number);

    /** The battlers current health */
    get health(): number;
    set health(value: number);

    /** The battlers current speed */
    get speed(): number;
    set speed(value: number);

    /** The battlers inventory of items */
    get inventory(): Inventory;

    /** The battlers position */
    get position(): Vec2;
    set position(value: Vec2);

    /** Whether the battler is active or not */
    get battlerActive(): boolean;
    set battlerActive(value: boolean);

}