import {
  ENavigationDirection,
  INavigationMap,
  INavigationMapActiveState,
  INavigationRow,
} from "./types";
import utilNavigation from "./utilNavigation";

/*

    { layer:0

        vs:0,0 {Sidenav}                      vs:0,1 {body} 
        [                                   [
            row:0 [ 0, 1, 2, 3, 4, 5]           row:0 [ 0, 1, 2, 3, 4, 5] 
            row:1 [ 0, 1, 2, 3, 4, 5]           row:1 [ 0, 1, 2, 3, 4, 5]
            row:2 [ 0, 1, 2, 3, 4, 5]           row:2 [ 0, 1, 2, 3, 4, 5]
            row:3 [ 0, 1, 2, 3, 4, 5]           row:3 [ 0, 1, 2, 3, 4, 5]
        ],                                  ]
    }
*/

class NavigationMap {
  public map: INavigationMap = {};
  public activeState: INavigationMapActiveState = {
    layer: 0,
    vs: [0, 0],
    row: 0,
    item: 0,
  };

  // ----------------------
  //     PRIVATE FNs
  // ----------------------

  private checkToNavigateNextVs = (activeLayer: number, targetVs: number[]) => {
    const targetVsStr = targetVs.join(",");

    if (!this.map[activeLayer].vss[targetVsStr]) return;

    const lastRecordedRowId =
      this.map[activeLayer].vss[targetVsStr].lastFocusedRowIndex;

    this.activeState = {
      layer: this.activeState.layer,
      vs: targetVs,
      row: lastRecordedRowId,
      item: this.map[activeLayer].vss[targetVsStr].rows[lastRecordedRowId]
        .lastFocusedItemIndex,
    };

    this.map[activeLayer].lastFocusedVs = targetVs;
  };

  private navigateVertical = (direction: ENavigationDirection) => {
    const activeLayer = this.activeState.layer;
    const [activeVsX, activeVsY] = this.activeState.vs;
    const activeVsStr = this.activeState.vs.join(",");
    const activeRow = this.activeState.row;

    let targetRow = activeRow + 1;
    let targetVs = [activeVsX, activeVsY + 1];

    if (direction === ENavigationDirection.UP) {
      targetRow = activeRow - 1;
      targetVs = [activeVsX, activeVsY - 1];
    }

    // if target row exist
    if (this.map[activeLayer].vss[activeVsStr].rows[targetRow]) {
      // Update activeState
      this.activeState = {
        ...this.activeState,
        row: targetRow,
        item: this.map[activeLayer].vss[activeVsStr].rows[targetRow]
          .lastFocusedItemIndex,
      };

      // Update map record
      this.map[activeLayer].vss[activeVsStr].lastFocusedRowIndex = targetRow;

      return;
    }
    // check if target VS is next
    this.checkToNavigateNextVs(activeLayer, targetVs);
  };

  private navigateHorizntal(direction: ENavigationDirection) {
    const activeLayer = this.activeState.layer;
    const [activeVsX, activeVsY] = this.activeState.vs;
    const activeVsStr = this.activeState.vs.join(",");
    const activeRow = this.activeState.row;
    const activeItem = this.activeState.item;

    let targetItem = activeItem + 1;
    let targetVs = [activeVsX + 1, activeVsY];

    if (direction === ENavigationDirection.LEFT) {
      targetItem = activeItem - 1;
      targetVs = [activeVsX - 1, activeVsY];
    }

    // if target Item exist
    if (
      this.map[activeLayer].vss[activeVsStr].rows[activeRow].items[targetItem]
    ) {
      // update active state
      this.activeState = {
        ...this.activeState,
        row: activeRow,
        item: targetItem,
      };

      // Update map record
      this.map[activeLayer].vss[activeVsStr].rows[
        activeRow
      ].lastFocusedItemIndex = targetItem;

      return;
    }
    // check if target VS is next
    this.checkToNavigateNextVs(activeLayer, targetVs);
  }

  // ----------------------
  //     CONSTRUCTOR
  // ----------------------
  constructor(rowDataObj: INavigationRow, vsId: number[], layerId: number) {
    this.setNewVs(rowDataObj, vsId, layerId);
  }

  // ----------------------
  //     PUBLIC FNs
  // ----------------------

  public setNewVs = (
    rowsDataObj: INavigationRow,
    vsXYId: number[], // like ["-1,0"] ,["0,0"], ["0,1"],
    layerId: number
  ) => {
    if (!this.map[layerId]) {
      this.map[layerId] = {
        lastFocusedVs: vsXYId,
        vss: {},
      };
    }

    const vsXYIdStr = vsXYId.join(",");

    if (this.map[layerId] && !this.map[layerId].vss[vsXYIdStr]) {
      this.map[layerId].vss[vsXYIdStr] = {
        rows: rowsDataObj,
        lastFocusedRowIndex: 0,
      };
    }
  };

  // Every time focus changes on the Map, this mothod hepls keeping the map uptodate with change
  public updateMapData = (
    layerId: number,
    vsIndex: string,
    rowIndex: number,
    itemIndex: number
  ) => {
    if (!this.map[layerId]?.vss[vsIndex]?.rows[rowIndex]?.items[itemIndex]) {
      console.log("Violation map focus update");
      return;
    }

    const vsIdArr = utilNavigation.vsStringToNumberArr(vsIndex);

    this.activeState.layer = layerId;
    this.activeState.vs = vsIdArr;
    this.activeState.row = rowIndex;
    this.activeState.item = itemIndex;

    this.map[layerId].lastFocusedVs = vsIdArr;
    this.map[layerId].vss[vsIndex].lastFocusedRowIndex = rowIndex;
    this.map[layerId].vss[vsIndex].rows[rowIndex].lastFocusedItemIndex =
      itemIndex;
  };

  public navigate = (
    direction: ENavigationDirection
  ): INavigationMapActiveState => {
    if (
      direction === ENavigationDirection.UP ||
      direction === ENavigationDirection.DOWN
    )
      this.navigateVertical(direction);
    else this.navigateHorizntal(direction);

    return this.activeState;
  };
}

export default NavigationMap;
