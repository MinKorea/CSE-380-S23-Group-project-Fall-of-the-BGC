import Stack from "../../DataTypes/Collections/Stack";
import GoapAction from "./GoapAction";
import GoapActionPlanner from "./GoapActionPlanner"
import GameEvent from "../../Events/GameEvent";
import GameNode from "../../Nodes/GameNode";
import AI from "../../DataTypes/Interfaces/AI";
import Map from "../../DataTypes/Collections/Map";
import Actor from "../../DataTypes/Interfaces/Actor";
import GoapState from "./GoapState";
import StateMachineAI from "../StateMachineAI";

/**
 * An implementation of basic Goap behavior.
 * 
 * GOAP requires a lot of overhead for managing all of the symbols (statuses and goals), the
 * actual goap-actions, and creating the action plans. 
 * 
 * I've opted to try and extend the StateMachineAI for this class, mostly to try and keep things
 * similar to the StateMachineAI. My StateMachineGoapAI class kind of breaks LSP (Liskov's substitution principle)
 * which cues me into the fact that I should probably make a seperate class.
 * 
 * Something I'd like to add is an additional class for managing a set of goals. The goals 
 * are pretty similar to statuses, except that goals have some kind off priority associated
 * with them. Not sure how we'd do this.
 * 
 * @author Peter Walsh
 */
export default abstract class StateMachineGoapAI<T extends GoapAction> extends StateMachineAI {

    /** The parent Actor of this GoapAI */
    protected owner: GameNode;

    /** The goal/status we're trying to reach */
    protected goal: string;
    /** All statuses for this GoapAI */
    protected statuses: Map<GoapState>
    /** All of the action the GOAP AI can perform */
    protected stateMap: Map<T>;

    public constructor() {
        super();
        this.statuses = new Map<GoapState>();
        this.stateMap = new Map<T>();
        this.stack = new Stack<T>();
        this.goal = null;
    }


    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public override initialize(): void {
        // Initialize the AI by building a plan from the the current actions
        this.stack = this.buildPlan();
        this.currentState = this.stack.peek();
        this.currentState.onEnter({});
        this.setActive(true);
    }

    // NOTE; this method might trigger infinite recursion in your GOAP AI - Peteylumpkins
    public override changeState(): void {
        // Exit the current state
        let options = this.currentState.onExit();

        // Remove the previous state
        this.stack.pop();

        // If the plan is empty, build a new plan
        if (this.stack.isEmpty()) {
            this.stack = this.buildPlan();
        }

        // Set the current action
        this.currentState = this.stack.peek();

        // Emit an event if turned on
        if(this.emitEventOnStateChange){
            this.emitter.fireEvent(this.stateChangeEventName, {state: this.currentState});
        }

        // Enter the new action
        this.currentState.onEnter(options);
    }
   
    protected buildPlan(): Stack<T> {
        // Get all the current statuses
        let statuses = this.currentStatus();
        // Get all the current actions
        let actions = Array.from(this.stateMap.keys()).map(key => this.stateMap.get(key));
        // Create the plan
        return GoapActionPlanner.plan<T>(statuses, this.goal, actions);
    }

    public currentStatus(): string[] {
        return Array.from(this.statuses.keys()).filter(stat => this.statuses.get(stat).isSatisfied());
    }

    public setGoal(goal: string) { 
        if (!this.statuses.has(goal)) {
            throw new Error("Goal doesn't exist. Make sure your goal is a status for this GOAP AI")
        }   
        this.goal = goal;
    }

    public addStatus(statusName: string, status: GoapState): void {
        this.statuses.set(statusName, status);
    }

    public addState(stateName: string, state: GoapAction): void {
        super.addState(stateName, state);
    }


}