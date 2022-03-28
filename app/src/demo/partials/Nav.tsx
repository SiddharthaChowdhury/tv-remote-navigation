import { useContext } from "react";
import { INavigationRow } from "../../navigation/types";
import utilNavigation from "../../navigation/utilNavigation";
import MapContext from "../MapContext";
import { IMockData } from "../mocks/IMockData";

interface INavProps {
  layerId: number;
  vsId: number[];
  navData: IMockData[];
}

const Nav = ({ layerId, vsId, navData }: INavProps) => {
  const mapCtx = useContext(MapContext);

  const generateNav = () => {
    const rowsData: INavigationRow = {};

    const nav = navData.map((laneInfo: IMockData, rowId: number) => {
      if (!rowsData[rowId]) {
        rowsData[rowId] = {
          lastFocusedItemIndex: 0,
          items: [],
        };
      }

      const navButton = laneInfo.data[0];
      const itemId = utilNavigation.generateItemId(layerId, vsId, rowId, 0);

      rowsData[rowId].items.push(itemId);

      return (
        <div
          key={rowId}
          data-type="row"
          className="nav-row"
          id={utilNavigation.generateLaneId(layerId, vsId, rowId)}
        >
          <div data-type="item" className="nav-row--item" id={itemId}>
            {navButton.label}
          </div>
        </div>
      );
    });

    mapCtx?.mapObj.addNewVs(rowsData, vsId, layerId);

    return nav;
  };

  return <div className="side-nav">{generateNav()}</div>;
};

export default Nav;
