import PositionGraph from "../DataTypes/Graphs/PositionGraph";
import Navigable from "../DataTypes/Pathfinding/Navigable";
import Vec2 from "../DataTypes/Vec2";
import NavigationPath from "./NavigationPath";
import NavigationStrategy from "./Strategies/NavigationStrategy";

/**
 * An implementation of a Navmesh. Navmeshes are graphs in the game world along which nodes can move.
 */
export default class Navmesh implements Navigable<Vec2, NavigationPath> {
	/** The graph of points in the NavMesh */
	protected _graph: PositionGraph;
    /** The strategy used to generate the NavigationPath */
    protected _strategies: Map<string, NavigationStrategy>;
    /** The strategy currently being used to generate paths on this Navmesh */
    protected _strategy: NavigationStrategy | undefined;

	/**
	 * Creates a new Navmesh from the points in the speecified graph. Navigation is done using the 
     * given NavigationStrategy. 
	 * @param graph the graph to construct a navmesh from
     * @param strategy a constructor for strategy to use to build paths for this navmesh
	 */
	public constructor(graph: PositionGraph){
		this._graph = graph;
        this._strategies = new Map<string, NavigationStrategy>();
        this._strategy = undefined;
	}

    public get graph(): PositionGraph { return this._graph; }

    public setStrategy(strategy: string) { this._strategy = this._strategies.get(strategy); }

	// @implemented
	getNavigationPath(fromPosition: Vec2, toPosition: Vec2): NavigationPath {
        if (this._strategy === undefined) { 
            throw new Error("Error.No pathfinding strategy set for this navmesh.");
        }
		return this._strategy.buildPath(toPosition, fromPosition);
	}

    registerStrategy(key: string, strategy: NavigationStrategy): void {
        this._strategies.set(key, strategy);
    }

}