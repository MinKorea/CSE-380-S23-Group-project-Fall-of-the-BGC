import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Color from "../../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import HW4Scene from "../../../Scenes/HW4Scene";
import Item from "../Item";

export default class LaserGun extends Item {

    public damage: number;

    protected _laser: Line
    protected _direction: Vec2;

    public constructor(sprite: Sprite, laser: Line) {
        super(sprite);
        this._laser = laser;
        this._laser.start.copy(Vec2.ZERO_STATIC);
        this._laser.end.copy(Vec2.ZERO_STATIC);
        this._laser.color = Color.GREEN;
        this._laser.tweens.add("fade", {
            startDelay: 0,
            duration: 300,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            onEnd: "Laser faded"
        });
        this._direction = Vec2.ZERO;
    }

    public static create(sprite: Sprite, laser: Line): LaserGun {
        return new LaserGun(sprite, laser);
    }

    public get direction(): Vec2 { return this._direction; }
    public get laserStart(): Vec2 { return this._laser.start; }
    public get laserEnd(): Vec2 { return this._laser.end; }

    public playShootAnimation(): void { this._laser.tweens.play("fade"); }
    
}