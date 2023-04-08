import Stack from "../../DataTypes/Collections/Stack";
import Vec2 from "../../DataTypes/Vec2";
import GraphUtils from "../../Utils/GraphUtils";
import NavigationPath from "../NavigationPath";
import NavPathStrat from "./NavigationStrategy";

/**
 * Constructs a navigation path for Wolfie2D using djikstras shortest path algorithm. This
 * was the original implementation used in the NavigationPath class.
 * @author PeteyLumpkins
 */
export default class DjikstraPathStrat extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        // Get the closest nodes in the graph to our to and from positions
        let start = this.mesh.graph.snap(from);
		let end = this.mesh.graph.snap(to);

		let pathStack = new Stack<Vec2>(this.mesh.graph.numVertices);
		
		// Push the final position and the final position in the graph
		pathStack.push(to.clone());
		pathStack.push(this.mesh.graph.positions[end]);

        // Use Djikstras to construct the path
		let parent = GraphUtils.djikstra(this.mesh.graph, start);

		// Add all parents along the path
		let i = end;
		while(parent[i] !== -1){
			pathStack.push(this.mesh.graph.positions[parent[i]]);
			i = parent[i];
		}

		return new NavigationPath(pathStack);
    }
    
}