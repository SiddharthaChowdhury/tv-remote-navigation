import { INavigationMapMeta } from "./types";

const utilNavigation = {
  vsStrToNumberArr: (vsIdString: string) => {
    const [x, y] = vsIdString.split("_");
    return [parseInt(x), parseInt(y)];
  },

  vsNumberArrToStr: (vsNumberArr: number[]) => {
    const [x, y] = vsNumberArr;
    return `${x}_${y}`;
  },

  generateItemId: (
    layerId: number,
    vsId: number[],
    rowId: number,
    itemId: number
  ) => {
    return `${layerId}-${utilNavigation.vsNumberArrToStr(
      vsId
    )}-${rowId}-${itemId}`;
  },

  itemIdToMapMeta: (itemIdStr: string): INavigationMapMeta => {
    const [layerId, vsIdStr, rowId, itemId] = itemIdStr.split("-");
    const vsId = utilNavigation.vsStrToNumberArr(vsIdStr);

    return {
      layer: parseInt(layerId),
      vs: vsId,
      row: parseInt(rowId),
      item: parseInt(rowId),
    };
  },
};

export default utilNavigation;
