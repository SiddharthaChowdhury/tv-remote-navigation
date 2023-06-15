import {
  ENavigationDirection,
  INavigationMap,
  INavigationMapMeta,
  INavigationRow,
  TCustomFocusKey,
  TLayerActiveStates,
} from "./types";
import utilNavigation from "./utilNavigation";

/*

    { layer:0

        vs:0,0 {Sidenav}                      vs:1,0 {body/section} 
        [                                   [
            row:0 [ 0, 1, 2, 3, 4, 5]           row:0 [ 0, 1, 2, 3, 4, 5] 
            row:1 [ 0, 1, 2, 3, 4, 5]           row:1 [ 0, 1, 2, 3, 4, 5]
            row:2 [ 0, 1, 2, 3, 4, 5]           row:2 [ 0, 1, 2, 3, 4, 5]
            row:3 [ 0, 1, 2, 3, 4, 5]           row:3 [ 0, 1, 2, 3, 4, 5]
        ],                                  ]
    }
*/
export interface INavigationMapState extends INavigationMapMeta {}
const initialActiveState: INavigationMapState = {
  layer: 0,
  vs: [0, 0],
  row: 0,
  item: 0,
};

class NavigationMap {
  public name: string = "";
  public customFocusKeyTable: TCustomFocusKey = {}; // Dictionary of Custom focus keys
  public layerActiveState: TLayerActiveStates = {}; // To keep record of active state, useful when switching between layers {[layer]: INavigationMapState}

  public map: INavigationMap = {
    activeLayer: 0,
    layers: {},
  };
  public activeState: INavigationMapState = {
    ...initialActiveState,
  };

  constructor(name: string = "") {
    this.name = name;
  }

  // ----------------------
  //     PRIVATE FNs
  // ----------------------

  // This function changes focus between Vs/Containers
  private checkToNavigateNextVs = (
    activeLayer: number,
    targetVs: number[],
    skipCommit?: boolean
  ) => {
    const targetVsStr = utilNavigation.vsNumberArrToStr(targetVs);

    if (!this.map.layers[activeLayer].vss[targetVsStr]) return;

    const lastRecordedRowId =
      this.map.layers[activeLayer].vss[targetVsStr].lastFocusedRowIndex;

    if (skipCommit) {
      return {
        layer: this.activeState.layer,
        vs: targetVs,
        row: lastRecordedRowId,
        item: this.map.layers[activeLayer].vss[targetVsStr].rows[
          lastRecordedRowId
        ].lastFocusedItemIndex,
      };
    }

    // Update the active state
    this.activeState = {
      layer: this.activeState.layer,
      vs: targetVs,
      row: lastRecordedRowId,
      item: this.map.layers[activeLayer].vss[targetVsStr].rows[
        lastRecordedRowId
      ].lastFocusedItemIndex,
    };

    this.map.layers[activeLayer].lastFocusedVs = targetVs;
    // Broadcast focus changed
    // emitter.emit("itemFocused", this.activeState);
  };

  private navigateVertical = (
    direction: ENavigationDirection,
    skipCommit?: boolean // if true; will only return next navState, but will not actually update the focus state in the map
  ) => {
    const activeLayer = this.activeState.layer;
    const [activeVsX, activeVsY] = this.activeState.vs;
    const activeVsStr = utilNavigation.vsNumberArrToStr(this.activeState.vs);
    const activeRow = this.activeState.row;
    const isGrid = !!this.map.layers[activeLayer].vss[activeVsStr].gridBehavior;

    let targetRow = activeRow + 1;
    let targetVs = [activeVsX, activeVsY + 1];

    if (direction === ENavigationDirection.UP) {
      targetRow = activeRow - 1;
      targetVs = [activeVsX, activeVsY - 1];
    }

    // if target row exist
    if (this.map.layers[activeLayer].vss[activeVsStr].rows[targetRow]) {
      const newState = {
        ...this.activeState,
        row: targetRow,
        item: this.map.layers[activeLayer].vss[activeVsStr].rows[targetRow]
          .lastFocusedItemIndex,
      };

      if (isGrid) {
        const currentItemIndex = this.activeState.item;
        if (
          this.map.layers[activeLayer].vss[activeVsStr].rows[targetRow].items[
            currentItemIndex
          ]
        ) {
          newState.item = currentItemIndex;
        }
      }

      if (skipCommit) {
        return newState;
      }

      // Update activeState
      this.activeState = { ...newState };

      // Update map record
      this.map.layers[activeLayer].vss[activeVsStr].lastFocusedRowIndex =
        targetRow;

      // Broadcast focus changed
      // emitter.emit("itemFocused", this.activeState);

      return;
    }
    // check if target VS is next
    return this.checkToNavigateNextVs(activeLayer, targetVs, skipCommit);
  };

  private navigateHorizontal(
    direction: ENavigationDirection,
    skipCommit?: boolean
  ) {
    const activeLayer = this.activeState.layer;
    const [activeVsX, activeVsY] = this.activeState.vs;
    const activeVsStr = utilNavigation.vsNumberArrToStr(this.activeState.vs);
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
      this.map.layers[activeLayer].vss[activeVsStr].rows[activeRow].items[
        targetItem
      ]
    ) {
      if (skipCommit) {
        return {
          ...this.activeState,
          row: activeRow,
          item: targetItem,
        };
      }

      // update active state
      this.activeState = {
        ...this.activeState,
        row: activeRow,
        item: targetItem,
      };

      // Update map record
      this.map.layers[activeLayer].vss[activeVsStr].rows[
        activeRow
      ].lastFocusedItemIndex = targetItem;

      // Broadcast focus changed
      // emitter.emit("itemFocused", this.activeState);

      return;
    }
    // check if target VS is next
    return this.checkToNavigateNextVs(activeLayer, targetVs, skipCommit);
  }

  // ----------------------
  //     PUBLIC FNs
  // ----------------------

  // Switch layers
  // Restores previous activeState from each layer (if exists)
  // @param reset: layer to not restore previous active state
  public switchLayer = (layer: number, reset?: boolean) => {
    const currentActiveState = this.activeState;
    if (currentActiveState.layer === layer) return;

    if (this.layerActiveState[layer] && !reset) {
      this.layerActiveState[currentActiveState.layer] = this.activeState;
      this.activeState = this.layerActiveState[layer];
    } else {
      this.layerActiveState[currentActiveState.layer] = this.activeState;
      this.activeState = {
        ...initialActiveState,
        layer,
      };
    }
  };

  // This function is responsible for mapping custom name to an item in the map.
  public attachCustomFocusToItem = (
    customName: string,
    { layer, vs, row, item }: INavigationMapMeta
  ) => {
    const itemId = utilNavigation.generateItemId(layer, vs, row, item);
    this.customFocusKeyTable[customName] = itemId;
  };

  // This function updates activeState to change the current focus to a custom-named item mapped in the "customFocusKeyTable"
  public setFocus = (customName: string) => {
    const realId = this.customFocusKeyTable[customName];
    const mapMeta: INavigationMapMeta = utilNavigation.itemIdToMapMeta(realId);

    this.updateMapData(mapMeta);
  };

  // This function adds a new container/vs to the map
  public addNewVs = (
    rowsDataObj: INavigationRow,
    vsXYId: number[], // like ["-1,0"] ,["0,0"], ["0,1"],
    layerId: number,
    enableGrid?: boolean
  ) => {
    if (!this.map.layers[layerId]) {
      this.map.layers[layerId] = {
        lastFocusedVs: vsXYId,
        vss: {},
      };
    }

    const vsXYIdStr = utilNavigation.vsNumberArrToStr(vsXYId);

    if (this.map.layers[layerId] && !this.map.layers[layerId].vss[vsXYIdStr]) {
      this.map.layers[layerId].vss[vsXYIdStr] = {
        rows: rowsDataObj,
        lastFocusedRowIndex: 0,
        gridBehavior: !!enableGrid,
      };
    }
  };

  // This fn directly updates activeState, i.e. its useful when we want to change focus to any random item on the map.
  // To be used for manual "setFocus()" purpose when needed
  // Every time focus changes on the Map, this method helps keeping the map up-to-date with the new change
  public updateMapData = (mapMeta: INavigationMapMeta) => {
    const { layer, vs, row, item } = mapMeta;
    const vsIndex = utilNavigation.vsNumberArrToStr(vs);

    if (!this.map.layers[layer]?.vss[vsIndex]?.rows[row]?.items[item]) {
      console.warn("[focus-lib] Violation map focus update");
      return;
    }

    this.activeState.layer = layer;
    this.activeState.vs = vs;
    this.activeState.row = row;
    this.activeState.item = item;

    this.map.layers[layer].lastFocusedVs = vs;
    this.map.layers[layer].vss[vsIndex].lastFocusedRowIndex = row;
    this.map.layers[layer].vss[vsIndex].rows[row].lastFocusedItemIndex = item;

    // Broadcast focus changed
    // emitter.emit("itemFocused", this.activeState);

    return this.activeState;
  };

  // This function triggers the navigation and the resultant data-structure is updated
  public navigate = (direction: ENavigationDirection): INavigationMapMeta => {
    let mapMeta: INavigationMapMeta | undefined;
    if (
      direction === ENavigationDirection.UP ||
      direction === ENavigationDirection.DOWN
    ) {
      mapMeta = this.navigateVertical(direction);
    } else {
      mapMeta = this.navigateHorizontal(direction);
    }

    return mapMeta || this.activeState;
  };

  // This function returns -- the next focus Item but DOES NOT commit to the map data-structure
  // helpful for intercepting the navigation move, and if make any changes if needed
  // The output of this function can then be passed to "updateMapData()" method to trigger the navigation update
  public getNextNavigate = (
    direction: ENavigationDirection
  ): INavigationMapMeta | undefined => {
    if (
      direction === ENavigationDirection.UP ||
      direction === ENavigationDirection.DOWN
    ) {
      return this.navigateVertical(direction, true);
    } else return this.navigateHorizontal(direction, true);
  };

  // This let updating navigation behavior to gridStyle or the Default style
  public changeVsNavBehavior = (
    layer: number,
    vs: number[],
    gridBehavior: boolean
  ) => {
    const targetVsStr = utilNavigation.vsNumberArrToStr(vs);
    this.map.layers[layer].vss[targetVsStr].gridBehavior = gridBehavior;
  };

  // This is helpful for getting, for example next modalId
  public getNewNextLayer = () => {
    const layerIndexes = Object.keys(this.map.layers || {}).map((index) =>
      parseInt(index)
    );
    const currentMax = layerIndexes.length > 0 ? Math.max(...layerIndexes) : 0;

    return currentMax + 1;
  };

  // This is helpful to derive next Vs/Page id
  public getNewNextVs = (
    layerIndex: string,
    direction: "Left" | "Right" | "Up" | "Down" = "Down"
  ): number[] => {
    let nextVss = [0, 0];
    if (!direction || !this.map.layers[layerIndex]?.vss) return nextVss;

    const existingVs = Object.keys(this.map.layers[layerIndex].vss) || [];
    existingVs.forEach((vsId) => {
      const [x, y] = utilNavigation.vsStrToNumberArr(vsId);

      if (direction === "Left" && x < nextVss[0]) {
        nextVss[0] = x - 1;
      }
      if (direction === "Right" && x > nextVss[0]) {
        nextVss[0] = x + 1;
      }
      if (direction === "Up" && x < nextVss[1]) {
        nextVss[1] = x - 1;
      }
      if (direction === "Down" && x > nextVss[1]) {
        nextVss[1] = x + 1;
      }
    });

    return nextVss;
  };

  // Returns currently focused Item
  public getFocusedItem = () => {
    const { layer, vs, row, item } = this.activeState;

    return utilNavigation.generateItemId(layer, vs, row, item);
  };

  // Returns the Lane/row which has a focused child
  public getFocusedLaneId = () => {
    const { layer, vs, row } = this.activeState;

    return utilNavigation.generateLaneId(layer, vs, row);
  };

  // Returns the containerId which has a focused child
  public getFocusedVsId = () => {
    const { layer, vs } = this.activeState;

    return utilNavigation.generateContainerId(layer, vs);
  };
}

export default NavigationMap;
