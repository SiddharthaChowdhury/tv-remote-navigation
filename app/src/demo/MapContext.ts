import React from "react";
import NavigationMap from "../navigation/NavigationMap";
import { INavigationMap } from "../navigation/types";

export type TypeMapContext = {
  mapObj: NavigationMap;
  mapData: INavigationMap;
};
const MapContext = React.createContext<TypeMapContext | null>(null);

export const MapProvider = MapContext.Provider;
export default MapContext;
