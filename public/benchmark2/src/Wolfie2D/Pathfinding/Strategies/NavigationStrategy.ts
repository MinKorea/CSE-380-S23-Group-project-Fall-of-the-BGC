import PathStrat from "../../DataTypes/Pathfinding/PathStrategy";
import Vec2 from "../../DataTypes/Vec2";
import NavigationPath from "../NavigationPath";
import Navmesh from "../Navmesh";

/**
 * An abstract navigation strategy for Wolfie2Ds navigation system. You can extend this class to create
 * your own strategy for constructing a NavigationPath for the navigation system.
 * @author PeteyLumpkins
 */
export default abstract class NavigationStrategy implements PathStrat<Vec2, NavigationPath> {

    /** The Navmesh we're creating paths for */
    protected _mesh: Navmesh;

    public constructor(mesh: Navmesh) {
        this.mesh = mesh
    }

    protected get mesh(): Navmesh{ return this._mesh; }
    protected set mesh(mesh: Navmesh) { this._mesh = mesh; }
    
    /**
     * Builds a new NavigationPath. How the path is constructed is implementation specific.
     * @param to the position to navigate to
     * @param from the position to navigate from
     */
    public abstract buildPath(to: Vec2, from: Vec2): NavigationPath;
    
}