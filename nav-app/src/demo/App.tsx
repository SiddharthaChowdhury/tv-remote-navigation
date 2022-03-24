import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import NavigationMap from "../navigation/NavigationMap";
import { ENavigationDirection } from "../navigation/types";
import utilNavigation from "../navigation/utilNavigation";

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

const App = () => {
  useEffect(() => {
    const navObj = new NavigationMap(createNewDummVsData([0, 0], 2), [0, 0], 0);
    navObj.addNewVs(createNewDummVsData([1, 0], 2), [1, 0], 0);

    navObj.addNewVs(createNewDummVsData([0, 1], 2), [0, 1], 0);
    navObj.addNewVs(createNewDummVsData([0, -1], 2), [0, -1], 0);
    console.log("MAAAL rendered", JSON.stringify(navObj.map));
  }, []);

  return <h1>Hello</h1>;
};

export default App;
