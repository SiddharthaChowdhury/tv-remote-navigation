import { useEffect } from "react";
import { focusListener } from "../navigationV2/focusListener";
import { ENavigationDirection, TVsBehavior } from "../navigationV2/types";
import { useFocusProvider } from "../navigationV2/useFocusProvider";
import { View, useTVEventHandler } from "../react-native.components";
import { CardItem } from "./CardItem/CardItem";
import { FocusContainer } from "../navigationV2/FocusContainer";
import { FocusLane } from "../navigationV2/FocusLane";

const TEST_FOCUS_KEY = "BLA_BLA_1";
const PAGE_ID = "SPACIAL_PAGE";
const layoutRows = [
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
];

interface ISpacialHomeProps {
  behavior: TVsBehavior;
}

export const SpacialHomeExV3 = ({ behavior }: ISpacialHomeProps) => {
  const focusContext = useFocusProvider();

  useTVEventHandler((evt: any) => {
    const keyType = evt.eventType.toUpperCase();
    switch (keyType) {
      case "LEFT":
        focusListener.navigate(ENavigationDirection.LEFT, PAGE_ID);
        break;
      case "RIGHT":
        focusListener.navigate(ENavigationDirection.RIGHT, PAGE_ID);
        break;
      case "UP":
        focusListener.navigate(ENavigationDirection.UP, PAGE_ID);
        break;
      case "DOWN":
        focusListener.navigate(ENavigationDirection.DOWN, PAGE_ID);
        break;
    }
  });

  const generateItems = (rowId: number, data: string[]) => {
    const items = data.map((content, itemIndex) => {
      return (
        <CardItem
          focusKey={itemIndex === 2 && rowId === 1 ? TEST_FOCUS_KEY : undefined}
          context={focusContext}
          parentIndex={rowId}
          index={itemIndex}
          key={itemIndex}
        >
          {content}
        </CardItem>
      );
    });

    return items;
  };

  const generateRows = () => {
    return layoutRows.map((rowContent, rowIndex) => {
      return (
        <FocusLane
          key={rowIndex}
          index={rowIndex}
          context={focusContext}
          //   onChildGotFocused={(laneId) =>
          //     // console.log(">>>>>> Lane Focused ", laneId)
          //   }
          //   onChildGotBlurred={(laneId) =>
          //     console.log(">>>>>> Lane Blurred ", laneId)
          //   }
        >
          <View style={getStyle().row}>
            {generateItems(rowIndex, rowContent)}
          </View>
        </FocusLane>
      );
    });
  };

  useEffect(() => {
    focusListener.register(PAGE_ID, focusContext);
    console.log(">>>>>>>>>> MAP Obj", focusContext.mapObj.map);
    setTimeout(() => {
      focusListener.setFocus(TEST_FOCUS_KEY);
      // setFocusState(focusContext.mapObj.getFocusedItem());
    }, 3000);

    return () => {
      focusListener.deregister(PAGE_ID);
    };
  }, []);

  return (
    <FocusContainer
      context={focusContext}
      behavior={behavior}
      onChildGotFocused={(containerId) =>
        console.log(">>>>>> Container Focused ", containerId)
      }
      onChildGotBlurred={(containerId) =>
        console.log(">>>>>> Container Blurred ", containerId)
      }
    >
      <View style={getStyle().content}>{generateRows()}</View>
    </FocusContainer>
  );
};

const getStyle = (isItemFocused?: boolean) => {
  return {
    content: {
      maxWidth: 1280,
      maxHeight: 1000,
      display: "flex",
      flexDirection: "column",
    },

    row: {
      maxWidth: 1280,
      display: "flex",
      flexDirection: "row",
    },
    item: {
      width: 100,
      height: 100,
      backgroundColor: isItemFocused ? "#f9c5c5" : "#ffffff",
      borderColor: "#000",
      borderWidth: 1,
      borderRadius: 5,
      margin: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
};
