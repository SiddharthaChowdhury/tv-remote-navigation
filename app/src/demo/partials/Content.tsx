import { useContext, useEffect, useRef, useState } from "react";
import { animateFocus } from "../../animations/animate_Focus";
import { INavigationRow } from "../../navigation/types";
import utilNavigation from "../../navigation/utilNavigation";
import MapContext from "../MapContext";
import { IMockData } from "../mocks/IMockData";

interface IContentProps {
  layerId: number;
  vsId: number[];
  contentData: IMockData[];
}

const Content = ({ layerId, vsId, contentData }: IContentProps) => {
  const mapCtx = useContext(MapContext);
  const vsRef = useRef<HTMLDivElement | null>(null);
  const potentialVsHeight = useRef({ ready: false, height: 0 });

  const [content, setContent] = useState<any>(null);

  const generateContent = () => {
    if (!vsRef.current) return;
    const rowsData: INavigationRow = {};

    const teaserHeight = 150;
    const lanePadding = 15;

    const content = contentData.map((laneInfo: IMockData, rowId: number) => {
      if (!rowsData[rowId]) {
        rowsData[rowId] = {
          lastFocusedItemIndex: 0,
          items: [],
        };
      }

      const items = laneInfo.data.map((item, itemIndex) => {
        const itemId = utilNavigation.generateItemId(
          layerId,
          vsId,
          rowId,
          itemIndex
        );

        rowsData[rowId].items.push(itemId);

        return (
          <div
            data-type={"item"}
            id={itemId}
            className={"content-row--item"}
            key={itemIndex}
          >
            {`lane-${rowId} item-${itemIndex}`}
          </div>
        );
      });

      potentialVsHeight.current.height += teaserHeight + lanePadding;

      return (
        <div
          key={rowId}
          data-type="row"
          id={utilNavigation.generateLaneId(layerId, vsId, rowId)}
          className="content-row"
          style={{ top: `${rowId * 150}px`, left: "0" }}
        >
          {items}
        </div>
      );
    });

    // Update the map data-structure
    mapCtx?.mapObj.addNewVs(rowsData, vsId, layerId);
    potentialVsHeight.current.ready = true;

    setContent(content);
  };

  useEffect(() => {
    if (vsRef.current) {
      generateContent();
    }
  }, [vsRef.current]);

  useEffect(() => {
    if (
      potentialVsHeight.current.ready &&
      vsRef.current &&
      mapCtx?.mapObj.activeState
    ) {
      vsRef.current.style.height = `${potentialVsHeight.current.height}px`;

      // set initial focus
      const activeState = mapCtx?.mapObj.activeState;
      animateFocus(utilNavigation.getElementIdFromNavMapMeta(activeState));
    }
  }, [potentialVsHeight.current.ready]);

  return (
    <div
      ref={vsRef}
      data-type="vs"
      id={utilNavigation.vsNumberArrToStr(vsId)}
      className="content"
    >
      <div
        style={{
          width: "100%",
          position: "relative",
          display: "inline-flex",
          minHeight: "min-content",
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default Content;
