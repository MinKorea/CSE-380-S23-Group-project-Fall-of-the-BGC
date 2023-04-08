import AABB from "../../DataTypes/Shapes/AABB";
import Shape from "../../DataTypes/Shapes/Shape";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Vec2 from "../../DataTypes/Vec2";
import Debug from "../../Debug/Debug";
import Color from "../../Utils/Color";
import MathUtils from "../../Utils/MathUtils";
import { GraphicType } from "../Graphics/GraphicTypes";
import Tilemap from "../Tilemap";


export default class StaggeredIsometricTilemap extends Tilemap {

    public override getTilemapPosition(x: number, y: number): Vec2 {
        let col = x / this.tileSize.x / this.scale.x;
        let row = Math.floor(y / this.tileSize.y / this.scale.y * 2);
        if (row % 2 !== 0) {
            col = (x - this.tileSize.x / this.scale.x / 2) / this.tileSize.x / this.scale.x;
        }
        return new Vec2(Math.floor(col), row);
    }

    public override getWorldPosition(col: number, row: number): Vec2 {
        let x = col * this.tileSize.x * this.scale.x;
        let y = row * this.tileSize.y / 2 * this.scale.y;
        if (row % 2 !== 0) {
            x += this.tileSize.x * this.scale.x / 2;
        }
        return new Vec2(Math.floor(x), Math.floor(y));
    }

    public override getTileCollider(col: number, row: number): AABB {
        
        let tileSize = this.getScaledTileSize();

        let centerX = col * tileSize.x + tileSize.x / 2
        let centerY = row * tileSize.y / 2 + tileSize.y + tileSize.y / 2;
        if (row % 2 !== 0) {
            centerX += tileSize.x / 2;
        } 

        let center = new Vec2(centerX, centerY);
        let halfSize = tileSize.scaled(0.5);

        return new AABB(center, halfSize);
    }

    public override getMinColRow(region: AABB): Vec2 {
        return new Vec2(0, 0);
    }   

    public override getMaxColRow(region: AABB): Vec2 {
        return new Vec2(this.numCols, this.numRows);
    }

    protected parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void {
        // The size of the tilemap in local space
        this.numCols = tilemapData.width;
        this.numRows = tilemapData.height;

        // The size of tiles
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);

        // The size of the tilemap on the canvas
        this.size.set(this.numCols * this.tileSize.x, this.numRows * this.tileSize.y);
        this.position.copy(this.size.scaled(0.5));
        this.data = layer.data;
        this.visible = layer.visible;

        // Whether the tilemap is collidable or not
        this.isCollidable = false;
        if(layer.properties){
            for(let item of layer.properties){
                if(item.name === "Collidable"){
                    this.isCollidable = item.value;

                    // Set all tiles besides "empty: 0" to be collidable
                    for(let i = 1; i < this.collisionMap.length; i++){
                        this.collisionMap[i] = true;
                    }
                }
            }
        }
    }
    
    public override debugRender(): void {
        for (let i = 0; i < this.data.length; i++) {
            let rc = this.getTileColRow(i);
            let box = this.getTileCollider(rc.x, rc.y);
            Debug.drawBox(this.inRelativeCoordinates(box.center), box.halfSize.scale(this.scene.getViewScale()), false, Color.BLUE);
        }
    }
}