import {
  ENavigationDirection,
  INavMap,
  INavMapClick,
  INavMapMeta,
  INavMapRow,
  TCustomFocusKey,
  TVsBehavior,
} from "./types";
import utilNavigation from "./utilNavigation";

const initialActiveState: INavMapMeta = {
  vs: [0, 0],
  row: 0,
  item: 0,
};

class NavigationMapV2 {
  public customFocusKeyTable: TCustomFocusKey = {}; // Dictionary of Custom focus keys
  public map: INavMap = {
    lastFocusedVs: [0, 0],
    vss: {},
  };
  public activeState: INavMapMeta = {
    ...initialActiveState,
  };

  public clickedItem: INavMapClick = {};

  // ----------------------
  //     PRIVATE FNs
  // ----------------------

  // This function changes focus between Vs/Containers
  private checkToNavigateNextVs = (
    targetVs: number[],
    skipCommit?: boolean
  ) => {
    const targetVsStr = utilNavigation.vsNumberArrToStr(targetVs);

    if (!this.map.vss[targetVsStr]) return;

    const lastRecordedRowId = this.map.vss[targetVsStr]!.lastFocusedRowIndex;

    if (skipCommit) {
      return {
        vs: targetVs,
        row: lastRecordedRowId,
        item: this.map.vss[targetVsStr]!.rows[lastRecordedRowId]!
          .lastFocusedItemIndex,
      };
    }

    // Update the active state
    this.activeState = {
      vs: targetVs,
      row: lastRecordedRowId,
      item: this.map.vss[targetVsStr]!.rows[lastRecordedRowId]!
        .lastFocusedItemIndex,
    };

    this.map.lastFocusedVs = targetVs;
  };

  private navigateVertical = (
    direction: ENavigationDirection,
    skipCommit?: boolean // if true; will only return next navState, but will not actually update the focus state in the map
  ) => {
    const [activeVsX = 0, activeVsY = 0] = this.activeState.vs;
    const activeVsStr = utilNavigation.vsNumberArrToStr(this.activeState.vs);
    const activeRowIndex = this.activeState.row;
    const activeItemIndex = this.activeState.item;
    const behavior = this.map.vss[activeVsStr]?.behavior;

    let targetRow = activeRowIndex + 1;
    let targetVs = [activeVsX, activeVsY + 1];

    if (direction === ENavigationDirection.UP) {
      targetRow = activeRowIndex - 1;
      targetVs = [activeVsX, activeVsY - 1];
    }

    // if target row exist
    if (this.map.vss[activeVsStr]?.rows[targetRow]) {
      const newState = {
        ...this.activeState,
        row: targetRow,
        item: this.map.vss[activeVsStr]!.rows[targetRow]!.lastFocusedItemIndex,
      };

      if (behavior === "grid") {
        // Check the availability of next item and shift index to left if not available
        let targetIndex = activeItemIndex;
        let isTargetIndexUnavailable = false;
        do {
          if (
            this.map.vss[activeVsStr]!.rows[targetRow]!.items[targetIndex] ===
            undefined
          ) {
            targetIndex -= 1;
            isTargetIndexUnavailable = true;
          } else {
            isTargetIndexUnavailable = false;
          }
        } while (isTargetIndexUnavailable && targetIndex >= 0);

        newState.item = targetIndex;
      }

      if (
        behavior === "spacial-rows" &&
        this.map.vss[activeVsStr]?.rows[activeRowIndex]?.items[activeItemIndex]
      ) {
        let activeItemValue =
          this.map.vss[activeVsStr]!.rows[activeRowIndex]!.items[
            activeItemIndex
          ]!.value;

        const targetRowItems = [
          ...(this.map.vss[activeVsStr]?.rows[targetRow]?.items || []),
        ];

        let closestSumValueToActiveItemValue = targetRowItems.sort(
          (a, b) =>
            Math.abs(activeItemValue - a.value) -
            Math.abs(activeItemValue - b.value)
        )[0];

        let targetIndex = this.map.vss[activeVsStr]!.rows[
          targetRow
        ]?.items.findIndex(
          ({ name }) => name === closestSumValueToActiveItemValue?.name
        );

        if (targetIndex === -1) {
          console.warn(
            "[focus-lib] spacial navigation targetItem calculated incorrectly"
          );
          targetIndex = 0;
        }

        newState.item = targetIndex || 0;
      }

      if (skipCommit) {
        return newState;
      }

      // Update activeState
      this.activeState = { ...newState };

      // Update map record
      this.map.vss[activeVsStr]!.lastFocusedRowIndex = targetRow;

      return;
    }
    // check if target VS is next
    return this.checkToNavigateNextVs(targetVs, skipCommit);
  };

  private navigateHorizontal(
    direction: ENavigationDirection,
    skipCommit?: boolean
  ) {
    const [activeVsX = 0, activeVsY = 0] = this.activeState.vs;
    const activeVsStr = utilNavigation.vsNumberArrToStr(this.activeState.vs);
    const activeRowIndex = this.activeState.row;
    const activeItemIndex = this.activeState.item;

    let targetItemIndex = activeItemIndex + 1;
    let targetVs = [activeVsX + 1, activeVsY];

    if (direction === ENavigationDirection.LEFT) {
      targetItemIndex = activeItemIndex - 1;
      targetVs = [activeVsX - 1, activeVsY];
    }

    // if target Item exist
    if (
      this.map.vss[activeVsStr]?.rows[activeRowIndex]?.items[targetItemIndex]
    ) {
      if (skipCommit) {
        return {
          ...this.activeState,
          row: activeRowIndex,
          item: targetItemIndex,
        };
      }

      // update active state
      this.activeState = {
        ...this.activeState,
        row: activeRowIndex,
        item: targetItemIndex,
      };

      // Update map record
      this.map.vss[activeVsStr]!.rows[activeRowIndex]!.lastFocusedItemIndex =
        targetItemIndex;

      return;
    }
    // check if target VS is next
    return this.checkToNavigateNextVs(targetVs, skipCommit);
  }

  // ----------------------
  //     PUBLIC FNs
  // ----------------------

  // This function denotes currently clicked Item; It also allows to clear the clicked Item
  public clickSelectedItem = (shouldClear: "clear" | undefined) => {
    if (shouldClear === "clear") {
      this.clickedItem = {};
      return;
    }

    const { vs, row, item } = this.activeState;
    const itemId = utilNavigation.generateItemId(vs, row, item);

    if (this.clickedItem.itemId === itemId) {
      this.clickedItem.repeatCount! += 1;
      return;
    }

    this.clickedItem = {
      itemId,
      repeatCount: 1,
    };
  };

  // This function triggers the navigation and the resultant data-structure is updated
  public navigate = (direction: ENavigationDirection): INavMapMeta => {
    this.clickedItem = {};

    let mapMeta: INavMapMeta | undefined;
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

  // This function is responsible for mapping custom name to an item in the map.
  public attachCustomFocusToItem = (
    customName: string,
    { vs, row, item }: INavMapMeta
  ) => {
    const itemId = utilNavigation.generateItemId(vs, row, item);
    this.customFocusKeyTable[customName] = itemId;
  };

  // This fn directly updates activeState, i.e. its useful when we want to change focus to any random item on the map.
  // To be used for manual "setFocus()" purpose when needed
  // Every time focus changes on the Map, this method helps keeping the map up-to-date with the new change
  public updateMapData = (mapMeta: INavMapMeta) => {
    const { vs, row, item } = mapMeta;
    const vsIndex = utilNavigation.vsNumberArrToStr(vs);

    if (!this.map.vss[vsIndex]?.rows[row]?.items[item]) {
      console.warn("[focus-lib] Violation map focus update");
      return;
    }

    this.activeState.vs = vs;
    this.activeState.row = row;
    this.activeState.item = item;

    this.map.lastFocusedVs = vs;
    this.map.vss[vsIndex]!.lastFocusedRowIndex = row;
    this.map.vss[vsIndex]!.rows[row]!.lastFocusedItemIndex = item;

    return this.activeState;
  };

  // This function updates activeState to change the current focus to a custom-named item mapped in the "customFocusKeyTable"
  public setFocus = (customName: string) => {
    const realId = this.customFocusKeyTable[customName];

    if (realId === undefined) return;

    const mapMeta: INavMapMeta = utilNavigation.itemIdToMapMeta(realId);

    this.updateMapData(mapMeta);
  };

  // This function adds a new container/vs to the map
  public addNewVs = (
    rowsDataObj: INavMapRow,
    vsXYId: number[], // like ["-1,0"] ,["0,0"], ["0,1"],
    behavior: TVsBehavior = "default"
  ) => {
    const vsXYIdStr = utilNavigation.vsNumberArrToStr(vsXYId);

    if (!this.map.vss[vsXYIdStr]) {
      this.map.vss[vsXYIdStr] = {
        rows: rowsDataObj,
        lastFocusedRowIndex: 0,
        behavior,
      };
    }
  };

  // This is helpful to derive next Vs/Page id
  public getNewNextVs = (
    direction: "Left" | "Right" | "Up" | "Down" = "Down"
  ): number[] => {
    let nextVss = [0, 0];
    if (!direction || !this.map?.vss) return nextVss;

    const existingVs = Object.keys(this.map.vss) || [];
    existingVs.forEach((vsId) => {
      const [x = 0, y = 0] = utilNavigation.vsStrToNumberArr(vsId);

      if (direction === "Left" && x < nextVss[0]!) {
        nextVss[0] = x - 1;
      }
      if (direction === "Right" && x > nextVss[0]!) {
        nextVss[0] = x + 1;
      }
      if (direction === "Up" && x < nextVss[1]!) {
        nextVss[1] = x - 1;
      }
      if (direction === "Down" && x > nextVss[1]!) {
        nextVss[1] = x + 1;
      }
    });

    return nextVss;
  };

  // Returns currently focused Item
  public getFocusedItem = () => {
    const { vs, row, item } = this.activeState;

    return utilNavigation.generateItemId(vs, row, item);
  };

  // Returns the Lane/row which has a focused child
  public getFocusedLaneId = () => {
    const { vs, row } = this.activeState;

    return utilNavigation.generateLaneId(vs, row);
  };

  // Returns the containerId which has a focused child
  public getFocusedVsId = () => {
    const { vs } = this.activeState;

    return utilNavigation.generateContainerId(vs);
  };

  // This let updating navigation behavior to gridStyle or the Default style
  public changeVsNavBehavior = (vs: number[], behavior: TVsBehavior) => {
    const targetVsStr = utilNavigation.vsNumberArrToStr(vs);
    if (!this.map.vss[targetVsStr]) return;

    this.map.vss[targetVsStr]!.behavior = behavior;
  };
}

export default NavigationMapV2;
