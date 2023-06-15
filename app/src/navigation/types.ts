import NavigationMap, { INavigationMapState } from "./NavigationMap";

export interface INavigationMapMeta {
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
  activeLayer: number;
  layers: INavigationLayer;
}
export interface INavigationLayer {
  [layerId: string]: {
    lastFocusedVs: number[];
    vss: INavigationVs;
  };
}

export interface INavigationVs {
  [vsID: string]: {
    lastFocusedRowIndex: number;
    rows: INavigationRow;
    gridBehavior?: boolean;
  };
}

export enum ENavigationDirection {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  UP = "UP",
  DOWN = "DOWN",
}

export type TFocusRef = {
  layer: number;
  vs?: number[]; // [x: number; y: number]
  rows?: INavigationRow; // [ {"rowIndex": itemIndex[]} ]
};

interface IFocusCommonWrapperProps {
  context: IFocusProviderContext;
}

export interface IFocusItemProps extends IFocusCommonWrapperProps {
  parentIndex: number;
  index?: number;
  focusKey?: string;
  onFocus?: (itemId: string) => void;
  onBlur?: (itemId: string) => void;
}

export interface IFocusContainerProps extends IFocusCommonWrapperProps {
  enableGrid?: boolean;
  onChildGotFocused?: (containerId: string) => void;
  onChildGotBlurred?: (containerId: string) => void;
}

export interface IFocusLaneProps extends IFocusContainerProps {
  index: number;
}

export interface IFocusProviderContext extends Record<string, any> {
  focusRef: React.MutableRefObject<TFocusRef>;
  mapObj: NavigationMap;
  activeFocusedItemId?: string;
  lastFocusedItemId?: string;
  switchToLayer: (layer: number) => void;
  setFocus: (focusKey: string) => void;
  navigate: (direction: ENavigationDirection) => void;
  readNextMove: (
    direction: ENavigationDirection
  ) => INavigationMapMeta | undefined;
  navigateManual: (mapMeta: INavigationMapMeta) => void;
}

export interface IFocusProvider {
  context: IFocusProviderContext;
}

export type TCustomFocusKey = Record<string, string>;

export type TLayerActiveStates = Record<number, INavigationMapState>;
