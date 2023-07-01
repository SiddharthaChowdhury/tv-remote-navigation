import { INavMapMeta } from "./types";

const BLOCK_SEPARATOR = "|";
const VS_SEPARATOR = "_";
const utilNavigation = {
  vsStrToNumberArr: (vsIdString: string) => {
    const [x, y] = vsIdString.split(VS_SEPARATOR);
    return [parseInt(x), parseInt(y)];
  },

  vsNumberArrToStr: (vsNumberArr: number[]) => {
    const [x, y] = vsNumberArr;
    return `${x}${VS_SEPARATOR}${y}`;
  },

  generateContainerId: (vs: number[]) => {
    return `${utilNavigation.vsNumberArrToStr(vs)}`;
  },

  generateLaneId: (vs: number[], row: number) => {
    return `${utilNavigation.vsNumberArrToStr(vs)}${BLOCK_SEPARATOR}${row}`;
  },

  generateItemId: (vs: number[], row: number, item: number) => {
    return `${utilNavigation.generateLaneId(vs, row)}${BLOCK_SEPARATOR}${item}`;
  },

  getElementIdFromNavMapMeta: (navMapMeta: INavMapMeta) => {
    const { vs, row, item } = navMapMeta;
    return utilNavigation.generateItemId(vs, row, item);
  },

  itemIdToLaneId: (itemIdStr: string): string => {
    const { vs, row } = utilNavigation.itemIdToMapMeta(itemIdStr);
    return utilNavigation.generateLaneId(vs, row);
  },

  itemIdToContainerId: (itemIdStr: string): string => {
    const { vs } = utilNavigation.itemIdToMapMeta(itemIdStr);
    return utilNavigation.generateContainerId(vs);
  },

  itemIdToMapMeta: (itemIdStr: string): INavMapMeta => {
    const [vsIdStr, rowId, itemId] = itemIdStr.split(BLOCK_SEPARATOR);
    const vsId = utilNavigation.vsStrToNumberArr(vsIdStr);

    return {
      vs: vsId,
      row: parseInt(rowId),
      item: parseInt(itemId),
    };
  },
};

export default utilNavigation;
