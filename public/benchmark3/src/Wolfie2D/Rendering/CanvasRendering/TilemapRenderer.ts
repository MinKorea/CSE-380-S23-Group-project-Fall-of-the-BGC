import ResourceManager from "../../ResourceManager/ResourceManager";
import Scene from "../../Scene/Scene";
import OrthogonalTilemap from "../../Nodes/Tilemaps/OrthogonalTilemap";
import Vec2 from "../../DataTypes/Vec2";
import Tileset from "../../DataTypes/Tilesets/Tileset";
import Tilemap from "../../Nodes/Tilemap";
import IsometricTilemap from "../../Nodes/Tilemaps/IsometricTilemap";
import StaggeredIsometricTilemap from "../../Nodes/Tilemaps/StaggeredIsometricTilemap";

/**
 * A utility class for the @reference[CanvasRenderer] to render @reference[Tilemap]s
 */
export default class TilemapRenderer {
    protected resourceManager: ResourceManager;
    protected scene: Scene;
    protected ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D){
        this.resourceManager = ResourceManager.getInstance();
        this.ctx = ctx;
    }

    /**
     * Sets the scene of this TilemapRenderer
     * @param scene The current scene
     */
    setScene(scene: Scene): void {
        this.scene = scene;
    }

    /**
     * Renders an orthogonal tilemap
     * @param tilemap The tilemap to render
     */
    renderTilemap(tilemap: Tilemap): void {
        let previousAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = tilemap.getLayer().getAlpha();
        
        let origin = this.scene.getViewTranslation(tilemap);
        let size = this.scene.getViewport().getHalfSize();
        let zoom = this.scene.getViewScale();
        let bottomRight = origin.clone().add(size.scaled(2*zoom));

        if(tilemap.visible){
            let minColRow = tilemap.getMinColRow(this.scene.getViewport().getView());
            let maxColRow = tilemap.getMaxColRow(this.scene.getViewport().getView());
            for(let row = minColRow.y; row <= maxColRow.y; row++){
                for(let col = minColRow.x; col <= maxColRow.x; col++){
                    // Get the tile at this position
                    let tile = tilemap.getTile(col, row);

                    // Extract the rot/flip parameters if there are any
                    const mask = (0xE << 28);
                    const rotFlip = ((mask & tile) >> 28) & 0xF;
                    tile = tile & ~mask;

                    // Find the tileset that owns this tile index and render
                    for(let tileset of tilemap.getTilesets()){
                        if(tileset.hasTile(tile)){
                            this.renderTile(tilemap, tileset, tile, col, row, origin, tilemap.scale, zoom, rotFlip);
                        }
                    }
                }
            }
        }

        this.ctx.globalAlpha = previousAlpha;
    }

    /**
     * Renders a tile
     * @param tileset The tileset this tile belongs to 
     * @param tileIndex The index of the tile
     * @param tilemapRow The row of the tile in the tilemap
     * @param tilemapCol The column of the tile in the tilemap
     * @param origin The origin of the viewport
     * @param scale The scale of the tilemap
     * @param zoom The zoom level of the viewport
     */
    protected renderTile(tilemap: Tilemap, tileset: Tileset, tileIndex: number, tilemapCol: number, tilemapRow: number, origin: Vec2, scale: Vec2, zoom: number, rotFlip: number): void {
        let image = this.resourceManager.getImage(tileset.getImageKey());

        // Get the size of the tile to render
        let tileSize = tileset.getTileSize();
        let width = tileSize.x;
        let height = tileSize.y;

        // Calculate the position to start a crop in the tileset image
        let imagePosition = tileset.getImageOffsetForTile(tileIndex);
        let left = imagePosition.x
        let top = imagePosition.y;

        // Calculate the position in the world to render the tile
        let worldPosition = tilemap.getWorldPosition(tilemapCol, tilemapRow);

        let worldX = Math.floor((worldPosition.x - origin.x)*zoom);
        let worldY = Math.floor((worldPosition.y - origin.y)*zoom);

        // Calculate the size of the world to render the tile in
        let worldWidth = Math.ceil(width * scale.x * zoom);
        let worldHeight = Math.ceil(height * scale.y * zoom);

        if(rotFlip !== 0){
            let scaleX = 1;
            let scaleY = 1;
            let shearX = 0;
            let shearY = 0;

            // Flip on the x-axis
            if(rotFlip & 8){
                scaleX = -1;
            }

            // Flip on the y-axis
            if(rotFlip & 4){
                scaleY = -1;
            }

            // Flip over the line y=x
            if(rotFlip & 2){
                shearX = scaleY;
                shearY = scaleX;
                scaleX = 0;
                scaleY = 0;
            }

            this.ctx.setTransform(scaleX, shearX, shearY, scaleY, worldX + worldWidth/2, worldY + worldHeight/2);
        
            // Render the tile
            this.ctx.drawImage(image,
                left, top,
                width, height,
                -worldWidth/2, -worldHeight/2,
                worldWidth, worldHeight);

            if(rotFlip !== 0){
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        } else {
            // No rotations, don't do the calculations, just render the tile
            // Render the tile
            this.ctx.drawImage(image,
                left, top,
                width, height,
                worldX, worldY,
                worldWidth, worldHeight);
        }
    }


    protected getOrthogonalTileDrawPos(map: OrthogonalTilemap, set: Tileset, col: number, row: number): Vec2 {
        let imgsize: Vec2 = set.getTileSize().mult(map.scale);
        let mapsize: Vec2 = map.getScaledTileSize();
        return map.getWorldPosition(col, row).sub(imgsize.sub(mapsize));
    }
    protected getIsometricTileDrawPos(map: Tilemap, set: Tileset, col: number, row: number): Vec2 {
        let size: Vec2 = set.getTileSize();
        let drawPos: Vec2 = map.getScaledTileSize().sub(new Vec2(size.x*map.scale.x, size.y*map.scale.y));
        drawPos.inc(-size.x*map.scale.x/2, 0);
        drawPos.add(map.getWorldPosition(col, row));
        return drawPos;
    }
}