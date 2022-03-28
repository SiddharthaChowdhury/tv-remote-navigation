import { useCallback, useEffect, useRef } from "react";
import NavigationMap from "../navigation/NavigationMap";
import { MapProvider } from "./MapContext";
import { __mock__navData, __mock__pageData } from "./mocks/mockData";
import "./demoPage.css";
import Nav from "./partials/Nav";
import { ENavigationDirection } from "../navigation/types";
import { setFocus } from "./setFocus";
import utilNavigation from "../navigation/utilNavigation";
import Content from "./partials/Content";

const DemoPage = () => {
  const { current: mapObj } = useRef<NavigationMap>(new NavigationMap());

  const paintFocus = useCallback(() => {
    const { layer, row, vs, item } = mapObj.activeState;
    setFocus(utilNavigation.generateItemId(layer, vs, row, item));
  }, [mapObj.activeState]);

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

      paintFocus();
    });

    paintFocus();
  }, [mapObj, paintFocus]);

  return (
    <MapProvider
      value={{
        mapObj,
      }}
    >
      <div className="page">
        <Nav layerId={0} vsId={[0, 0]} navData={__mock__navData} />
        <Content layerId={0} vsId={[1, 0]} contentData={__mock__pageData} />
      </div>
    </MapProvider>
  );
};

export default DemoPage;
