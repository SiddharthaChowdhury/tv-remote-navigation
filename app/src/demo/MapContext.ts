import React from "react";
import NavigationMap from "../navigation/NavigationMap";

export type TypeMapContext = {
  mapObj: NavigationMap;
};
const MapContext = React.createContext<TypeMapContext | null>(null);

export const MapProvider = MapContext.Provider;
export default MapContext;
