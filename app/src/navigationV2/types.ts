import NavigationMapV2 from './NavSpacialMap';

export interface INavMapMeta {
  vs: number[];
  row: number;
  item: number;
}

export interface INavMapItem {
  name: string;
  value: number;
  widthMedian: number; // is basically the center point of the item : (width_of_item/2)
}

export interface INavMapRow {
  [rowIndex: number]: {
    lastFocusedItemIndex: number;
    items: INavMapItem[];
  };
}

export type TVsBehavior = 'default' | 'grid' | 'spacial-rows';

export interface INavMapVs {
  [vsID: string]: {
    behavior: TVsBehavior;
    lastFocusedRowIndex: number;
    rows: INavMapRow;
  };
}

export interface INavMap {
  lastFocusedVs: number[];
  vss: INavMapVs;
}

export enum ENavigationDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP = 'UP',
  DOWN = 'DOWN',
}

export type TFocusRef = {
  vs?: number[]; // [x: number; y: number]
  rows?: INavMapRow; // [ {"rowIndex": itemIndex[]} ]
};

interface IFocusCommonWrapperProps {
  context: IFocusProviderContext;
}

export interface IFocusItemProps extends IFocusCommonWrapperProps {
  parentIndex: number;
  itemWidth?: number; // useful for spacialNavigation
  index?: number;
  focusKey?: string;
  onFocus?: (itemId: string) => void;
  onBlur?: (itemId: string) => void;
}

export interface IFocusContainerProps extends IFocusCommonWrapperProps {
  behavior?: TVsBehavior;
  onChildGotFocused?: (containerId: string) => void;
  onChildGotBlurred?: (containerId: string) => void;
}

export interface IFocusLaneProps extends IFocusContainerProps {
  index: number;
}

export interface IFocusProviderContext extends Record<string, any> {
  focusRef: React.MutableRefObject<TFocusRef>;
  mapObj: NavigationMapV2;
  // activeFocusedItemId?: string;
  // lastFocusedItemId?: string;
  // setFocus: (focusKey: string) => void;
  // navigate: (direction: ENavigationDirection) => void;
  // readNextMove: (direction: ENavigationDirection) => INavMapMeta | undefined;
  // navigateManual: (mapMeta: INavMapMeta) => void;
}

export interface IFocusProvider {
  context: IFocusProviderContext;
}
export type TCustomFocusKey = Record<string, string>;
