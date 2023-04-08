import Graph from "../../DataTypes/Graphs/Graph";
import GoapAction from "./GoapAction";
import Stack from "../../DataTypes/Collections/Stack";
import GraphUtils from "../../Utils/GraphUtils";
import AI from "../../DataTypes/Interfaces/AI";

export default class GoapActionPlanner {
    
    public static plan<T extends GoapAction>(status: string[], goal: string, actions: Array<T>): Stack<T> {
        let graph: Graph = new Graph(true);
        let mapping: Map<number, T | string> = new Map();

        //0 is our root
        graph.addNode();
        mapping.set(0,"Start");
        //1 is the goal
        graph.addNode();
        mapping.set(1,"Goal");
        graph.addEdge(1,1,Number.POSITIVE_INFINITY);

        //Build tree from 0 to 1
        this.buildTree<T>(status, actions, 0, goal, mapping, graph);

        //Run djikstra to find shortest path
        let path: Array<number> = GraphUtils.djikstra(graph, 0);

        //Push all elements of the plan
        let plan = new Stack<T>();
		
		let i = 1;
		while(path[i] !== -1){
            if (path[i] !== 0){
			    plan.push(<T>mapping.get(path[i]));
            }
			i = path[i];
		}
        
        return plan;
    }

    private static buildTree  <T extends GoapAction> (status: string[], actions: Array<T>, root: number, goal: string, mapping: Map<number, T | string>, graph: Graph): void {
        //For each possible action 
        actions.forEach(action => {
            //Can it be performed?
            if (action.checkPreconditions(status)){
                //This action can be performed
                //Add effects to currentStatus
                let newStatus = [...status];
                newStatus.push(...action.effects);

                //Check if the new node is the goal
                if (newStatus.includes(goal)){
                    let newNode = graph.addNode();
                    mapping.set(newNode, action);
                    graph.addEdge(root, newNode, action.cost);
                    graph.addEdge(newNode, 1, 0);
                    return;
                }

                //Add node and edge from root
                let newNode = graph.addNode();
                mapping.set(newNode, action);
                graph.addEdge(root, newNode, action.cost);
                
                //Recursive call
                let newActions = actions.filter(act => act !== action)
                this.buildTree(newStatus, newActions, newNode, goal, mapping, graph);
            }
        });
    }
}