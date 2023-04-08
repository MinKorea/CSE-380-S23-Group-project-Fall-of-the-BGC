import Tilemap from "../Tilemap";
import Vec2 from "../../DataTypes/Vec2";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Debug from "../../Debug/Debug";
import Color from "../../Utils/Color";
import AABB from "../../DataTypes/Shapes/AABB";

/**
 * The representation of an orthogonal tilemap - i.e. a top down or platformer tilemap
 */
export default class OrthogonalTilemap extends Tilemap {

    public override getMinColRow(region: AABB): Vec2 {
        return this.getTilemapPosition(region.topLeft.x, region.topLeft.y);
    }
    public override getMaxColRow(region: AABB): Vec2 {
        return this.getTilemapPosition(region.bottomRight.x, region.bottomRight.y);
    }

    public override getTilemapPosition(x: number, y: number): Vec2 {
        let col = Math.floor(x / this.tileSize.x / this.scale.x);
        let row = Math.floor(y / this.tileSize.y / this.scale.y);
        return new Vec2(col, row);
    }

    public override getWorldPosition(col: number, row: number): Vec2 {
        let x = col * this.tileSize.x * this.scale.x;
        let y = row * this.tileSize.y * this.scale.y;
        return new Vec2(x, y);
    }

    public override getTileCollider(col: number, row: number): AABB {
        let tileSize = this.getScaledTileSize();

        let centerX = col * tileSize.x + tileSize.x / 2;
        let centerY = row * tileSize.y + tileSize.y / 2;

        let center = new Vec2(centerX, centerY);
        let halfSize = tileSize.scaled(0.5);

        return new AABB(center, halfSize);
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

    // @override
    update(deltaT: number): void {}

    // @override
    public override debugRender(){
        for (let i = 0; i < this.data.length; i++) {
            let cr = this.getTileColRow(i);
            if (this.isCollidable && this.isTileCollidable(cr.x, cr.y)) {
                let box = this.getTileCollider(cr.x, cr.y);
                Debug.drawBox(this.inRelativeCoordinates(box.center), box.halfSize.scale(this.scene.getViewScale()), false, Color.BLUE);
            }
        }
    }
}