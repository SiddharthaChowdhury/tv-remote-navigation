import { useEffect, useRef } from "react";
import NavigationMap from "../navigation/NavigationMap";
import { MapProvider } from "./MapContext";
import { __mock__navData } from "./mocks/mockData";
import "./demoPage.css";
import Nav from "./partials/Nav";
import { ENavigationDirection } from "../navigation/types";

const DemoPage = () => {
  const { current: mapObj } = useRef<NavigationMap>(new NavigationMap());

  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowRight":
          mapObj.navigate(ENavigationDirection.RIGHT);
          break;
        case "ArrowLeft":
          mapObj.navigate(ENavigationDirection.LEFT);
          break;
        case "ArrowUp":
          mapObj.navigate(ENavigationDirection.UP);
          break;
        case "ArrowDown":
          mapObj.navigate(ENavigationDirection.DOWN);
          break;
      }

      console.log(">> ", e.key, mapObj.activeState);
    });
  }, []);

  return (
    <MapProvider
      value={{
        mapObj,
      }}
    >
      <div className="page">
        <Nav layerId={0} vsId={[0, 0]} navData={__mock__navData} />
      </div>
    </MapProvider>
  );
};

export default DemoPage;
