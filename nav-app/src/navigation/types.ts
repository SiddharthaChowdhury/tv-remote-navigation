export interface INavigationMapActiveState {
  layer: number;
  vs: number[];
  row: number;
  item: number;
}

export interface INavigationRow {
  [rowIndex: number]: {
    lastFocusedItemIndex: number;
    items: string[];
  };
}

export interface INavigationMap {
  [layerId: string]: {
    lastFocusedVs: number[];
    vss: INavigationVs;
  };
}

export interface INavigationVs {
  [vsID: string]: {
    lastFocusedRowIndex: number;
    rows: INavigationRow;
  };
}

export enum ENavigationDirection {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  UP = "UP",
  DOWN = "DOWN",
}
