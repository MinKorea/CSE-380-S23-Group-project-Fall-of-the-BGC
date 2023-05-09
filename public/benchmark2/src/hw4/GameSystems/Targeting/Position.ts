import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

/**
 * A wrapper class around a Vec2 implementing the Positioned interface. The point
 * of this class is to let you use an arbitrary position as a TargetableEntity.
 */
export default class Position implements Positioned {

    private _position: Vec2;

    public constructor(x: number, y: number) {
        this._position = new Vec2(x, y);
    }

    public get position(): Vec2 {
        return this._position;
    }

    relativePosition: Vec2;
    
}