import { useRef } from "react";
import NavigationMap from "../navigation/NavigationMap";
import { MapProvider } from "./MapContext";

const DemoPage = () => {
  const { current: mapObj } = useRef<NavigationMap>(new NavigationMap());
  return (
    <MapProvider
      value={{
        mapObj,
        mapData: {
          activeLayer: 0,
          layers: {},
        },
      }}
    >
      HELLO
    </MapProvider>
  );
};

export default DemoPage;
