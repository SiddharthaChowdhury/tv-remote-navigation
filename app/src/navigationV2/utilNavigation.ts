import { INavMapMeta } from "./types";

const utilNavigation = {
  vsStrToNumberArr: (vsIdString: string) => {
    const [x, y] = vsIdString.split("_");
    return [parseInt(x), parseInt(y)];
  },

  vsNumberArrToStr: (vsNumberArr: number[]) => {
    const [x, y] = vsNumberArr;
    return `${x}_${y}`;
  },

  generateContainerId: (vs: number[]) => {
    return `${utilNavigation.vsNumberArrToStr(vs)}`;
  },

  generateLaneId: (vs: number[], row: number) => {
    return `${utilNavigation.vsNumberArrToStr(vs)}-${row}`;
  },

  generateItemId: (vs: number[], row: number, item: number) => {
    return `${utilNavigation.generateLaneId(vs, row)}-${item}`;
  },

  getElementIdFromNavMapMeta: (navMapMeta: INavMapMeta) => {
    const { vs, row, item } = navMapMeta;
    return utilNavigation.generateItemId(vs, row, item);
  },

  itemIdToLaneId: (itemIdStr: string): string => {
    const { vs, row } = utilNavigation.itemIdToMapMeta(itemIdStr);
    return utilNavigation.generateLaneId(vs, row);
  },

  itemIdToMapMeta: (itemIdStr: string): INavMapMeta => {
    const [vsIdStr, rowId, itemId] = itemIdStr.split("-");
    const vsId = utilNavigation.vsStrToNumberArr(vsIdStr);

    return {
      vs: vsId,
      row: parseInt(rowId),
      item: parseInt(itemId),
    };
  },
};

export default utilNavigation;
