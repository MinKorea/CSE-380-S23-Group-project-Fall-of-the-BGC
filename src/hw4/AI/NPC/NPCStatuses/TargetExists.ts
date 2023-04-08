import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Finder from "../../../GameSystems/Searching/Finder";

export class TargetExists<T> extends GoapState {

    protected targets: Readonly<T[]>;
    protected finder: Finder<T>;

    public constructor(targets: Readonly<T[]>, finder: Finder<T>) {
        super()
        this.finder = finder;
        this.targets = targets;
    }

    public isSatisfied(): boolean {
        return this.finder.find(this.targets) !== null;
    }

}