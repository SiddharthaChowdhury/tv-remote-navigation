import { useCallback, useEffect, useRef } from "react";
import NavigationMap from "../navigation/NavigationMap";
import { MapProvider } from "./MapContext";
import { __mock__navData, __mock__pageData } from "./mocks/mockData";
import "./demoPage.css";
import { ENavigationDirection } from "../navigation/types";
import utilNavigation from "../navigation/utilNavigation";
import Content from "./partials/Content";
import laneScrollHorizontal from "../scrolls/laneScrollHorizontal";
import laneScrollVerical from "../scrolls/laneScrollVertical";
import { animateFocus } from "../animations/animate_Focus";

const DemoPage = () => {
  const { current: mapObj } = useRef<NavigationMap>(new NavigationMap());

  const paintFocus = useCallback(() => {
    const { layer, row, vs, item } = mapObj.activeState;
    animateFocus(utilNavigation.generateItemId(layer, vs, row, item));
  }, [mapObj.activeState]);

  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowRight":
          const nexttarget = mapObj.getNextNavigate(ENavigationDirection.RIGHT);
          if (!nexttarget) return;
          laneScrollHorizontal(nexttarget, ENavigationDirection.RIGHT);
          nexttarget && mapObj.updateMapData(nexttarget);

          break;
        case "ArrowLeft":
          const nexttarget1 = mapObj.getNextNavigate(ENavigationDirection.LEFT);
          if (!nexttarget1) return;
          laneScrollHorizontal(nexttarget1, ENavigationDirection.LEFT);

          nexttarget1 && mapObj.updateMapData(nexttarget1);
          break;
        case "ArrowUp":
          const nexttarget2 = mapObj.getNextNavigate(ENavigationDirection.UP);

          if (!nexttarget2) return;
          laneScrollVerical(nexttarget2, ENavigationDirection.UP);

          nexttarget2 && mapObj.updateMapData(nexttarget2);
          break;
        case "ArrowDown":
          const nexttarget3 = mapObj.getNextNavigate(ENavigationDirection.DOWN);

          if (!nexttarget3) return;
          laneScrollVerical(nexttarget3, ENavigationDirection.DOWN);

          nexttarget3 && mapObj.updateMapData(nexttarget3);
          break;
      }

      paintFocus();
    });
  }, [mapObj, paintFocus]);

  return (
    <MapProvider
      value={{
        mapObj,
      }}
    >
      <div className="page">
        <Content layerId={0} vsId={[0, 0]} contentData={__mock__pageData} />
      </div>
    </MapProvider>
  );
};

export default DemoPage;
