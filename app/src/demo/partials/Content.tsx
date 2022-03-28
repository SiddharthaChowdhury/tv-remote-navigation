import { useContext } from "react";
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

  const generateContent = () => {
    const rowsData: INavigationRow = {};

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
            className={"content-row--item"}
            id={itemId}
            key={itemIndex}
          >
            {item.label}
          </div>
        );
      });

      return (
        <div
          key={rowId}
          data-type="row"
          className="content-row"
          id={utilNavigation.generateLaneId(layerId, vsId, rowId)}
        >
          {items}
        </div>
      );
    });

    // Update the map data-structure
    mapCtx?.mapObj.addNewVs(rowsData, vsId, layerId);

    return content;
  };

  return (
    <div
      className="content"
      data-type="vs"
      id={utilNavigation.vsNumberArrToStr(vsId)}
    >
      {generateContent()}
    </div>
  );
};

export default Content;
