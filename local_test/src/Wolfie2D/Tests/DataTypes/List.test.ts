import List from "../../DataTypes/Collections/List";

// Create a suite using describe() for the class. In this case, the class is list
describe("List", () => {

    // Create a nested suite using describe() for each of the tasks for the class
    describe("constructor", () => {

        // Put your tests for each task inside of the tasks suite. 
        it("Should construct an empty list", () => {
            let list = new List<number>();
            expect(list.size).toBe(0);
        });

    });

    describe("add(item: T): void;", () => {

        it("Should add a single item to the list", () => {
            let list = new List<number>();
            list.add(5);
            expect(list.size).toBe(1);
        });

        it("Should add multiple items to the list", () => {
            let list = new List<number>();
            list.add(-5);
            list.add(0);
            list.add(5);
            expect(list.size).toBe(3);
        });

    });

});
