import Graph from "../DataTypes/Graphs/Graph";
import EdgeNode from "../DataTypes/Graphs/EdgeNode";
import BinaryHeapSet from "../DataTypes/Collections/BinaryHeapSet";

/** A class to provides some utility functions for graphs */
export default class GraphUtils {

	/**
	 * An implementation of Djikstra's shortest path algorithm based on the one described in The Algorithm Design Manual.
	 * @param g The graph
	 * @param start The number to start the shortest path from
	 * @returns An array containing the parent of each node of the Graph in the shortest path.
	 */
	static djikstra(g: Graph, start: number): Array<number> {
		let i: number;		// Counter
		let p: EdgeNode;	// Pointer to edgenode
		let inTree: Array<boolean> = new Array(g.numVertices);
		let distance: Array<number> = new Array(g.numVertices);
		let parent: Array<number> = new Array(g.numVertices);
		let v: number;		// Current vertex to process
		let w: number; 		// Candidate for next vertex
		let weight: number;	// Edge weight
		let dist;			// Best current distance from start

		for(i = 0; i < g.numVertices; i++){
			inTree[i] = false;
			distance[i] = Infinity;
			parent[i] = -1;
		}

		distance[start] = 0;
		v = start;

		while(!inTree[v]){
			inTree[v] = true;
			p = g.edges[v];

			while(p !== null){
				w = p.y;
				weight = p.weight;

				if(distance[w] > distance[v] + weight){
					distance[w] = distance[v] + weight;
					parent[w] = v;
				}

				p = p.next;
			}

			v = 0;

			dist = Infinity;

			for(i = 0; i <= g.numVertices; i++){
				if(!inTree[i] && dist > distance[i]){
					dist = distance;
					v = i;
				}
			}
		}

		return parent;

	}

	/**
	 * An implementation of the A* algorithm
	 * @param g the graph to search
	 * @param start the node in the graph, g, to start searching from
	 * @param goal the node in the graph, g, that A* should try to reach
	 * @param heuristic the heuristic function used to calculate the f-score of a node in the graph, g
	 * @return if a path between start and goal exists, an array of nodes representing the path from start 
	 * to goal found by A*; otherwise null
	 */
	static astar(g: Graph, start: number, goal: number, heuristic: (node: number) => number): Array<number> {

		// Construct a new map of the gScores - start gets a gScore of 0
		let gScore = new Map<number, number>();
		gScore.set(start, 0);

		// Construct a new map of the fScores - f(n) = g(n) + h(n)
		let fScore = new Map<number, number>();
		fScore.set(start, heuristic(start));

		// Construct a new map to hold the path from start to goal
		let cameFrom = new Map<number, number>();

		// The open-set of nodes to be explored. Starts off with just starting node
		let openSet = new BinaryHeapSet<number>((e1, e2) => {
			let e1fScore = fScore.has(e1) ? fScore.get(e1) : Number.POSITIVE_INFINITY;
			let e2fScore = fScore.has(e2) ? fScore.get(e2) : Number.POSITIVE_INFINITY;
			if (e1fScore < e2fScore) return 1;
			return 0
		})
		openSet.push(start);

		// While there are elements in the openSet - explore the nodes
		while (!openSet.isEmpty()) {

			let current = openSet.peek();

			// If the next node is the goal - return the path
			if (current === goal) {
				let res = GraphUtils.astarPathBuilder(cameFrom, current);
				return res;
			}

			// Otherwise - remove the current node from the openSet and explore it's neighbors
			openSet.pop();

			// Iterate through the current node's edge list
			let edge = g.edges[current]

			while (edge !== null && edge !== undefined) {
				// Get the neighbor node from the edge
				let neighbor = edge.y;

				// Get tentative gscore
				let tentative_gscore = gScore.get(current) + edge.weight;

				// Get neighbors gscore - if neighbor doesn't have a gscore, default is positive infinity
				let neighbor_gscore = gScore.has(neighbor) ? gScore.get(neighbor) : Number.POSITIVE_INFINITY;

				if (tentative_gscore < neighbor_gscore) {

					cameFrom.set(neighbor, current);
					gScore.set(neighbor, tentative_gscore);
					fScore.set(neighbor, tentative_gscore + heuristic(neighbor));

					// If the openSet already contains the neighbor, then restore the heap about the neighbor
					if (openSet.has(neighbor)) {
						openSet.restore(neighbor);
					// Otherwise, the openSet doesn't contain the neighbor, so we add the neighbor to the openSet
					} else {
						openSet.push(neighbor);
					}
				}

				edge = edge.next;
			}
		}
		return null;
	}

	private static astarPathBuilder(cameFrom: Map<number, number>, current: number): Array<number> {
		let path = new Array();
		path.push(current);
		while (cameFrom.has(current)) {
			current = cameFrom.get(current);
			path.push(current);
		}
		path.reverse();
		return path;
	}    
}