import NavigationMap from "./NavigationMap";
import { ENavigationDirection } from "./types";
import utilNavigation from "./utilNavigation";

/*
const sampleVs_0_RowMap: INavigationRow = {
  0: {
    lastFocusedItemIndex: 0,
    items: ["0_0-0-0", "0_0-0-1"],
  },
  1: {
    lastFocusedItemIndex: 0,
    items: ["0_0-1-0", "0_0-1-1"],
  },
  2: {
    lastFocusedItemIndex: 0,
    items: ["0_0-2-0", "0_0-2-1"],
  },
};
*/
const createNewDummVsData = (vsId: number[], noLanes: number) => {
  const dummy: any = {};

  for (let i = 0; i < noLanes; i++) {
    dummy[i] = {
      lastFocusedItemIndex: 0,
      items: [],
    };

    for (let j = 0; j < 2; j++) {
      dummy[i].items.push(utilNavigation.generateItemId(0, vsId, i, j));
    }
  }

  return dummy;
};

/*
    Demonstrating the VS coordinates for our test

    layer: 0
    {
        [0, -1] -y
        
        [0, 0]      [1, 0] 

        [0, 1] +y
    }
*/

const navObj = new NavigationMap(createNewDummVsData([0, 0], 2), [0, 0], 0);
navObj.addNewVs(createNewDummVsData([1, 0], 3), [1, 0], 0);

navObj.addNewVs(createNewDummVsData([0, 1], 3), [0, 1], 0);
navObj.addNewVs(createNewDummVsData([0, -1], 3), [0, -1], 0); // vs

describe("Testing Navigation", () => {
  test("Navigation horizontal right", () => {
    const newState1 = navObj.navigate(ENavigationDirection.RIGHT);

    expect(newState1.vs).toEqual([0, 0]);
    expect(newState1.row).toEqual(0);
    expect(newState1.item).toEqual(1);

    const newState2 = navObj.navigate(ENavigationDirection.RIGHT);
    expect(newState2.vs).toEqual([1, 0]);
    expect(newState2.row).toEqual(0);
    expect(newState2.item).toEqual(0);

    navObj.navigate(ENavigationDirection.RIGHT);
    const newState3 = navObj.navigate(ENavigationDirection.RIGHT);
    expect(newState3.vs).toEqual([1, 0]);
    expect(newState3.row).toEqual(0);
    expect(newState3.item).toEqual(1);
  });
});
