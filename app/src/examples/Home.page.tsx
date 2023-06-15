import { useEffect } from "react";
import { ENavigationDirection } from "../navigation/types";
import { FocusContainer } from "../navigation/FocusContainer";
import { Card } from "./card/Card";
import { FocusLane } from "../navigation/FocusLane";
import { View, useTVEventHandler } from "./react-native.components";
import { useFocusProvider } from "../navigation/useFocusProvider";
import { focusListener } from "../navigation/activeListener";

const TEST_FOCUS_KEY = "BLA_BLA_1";
const PAGE_ID = "HOMEPAGE";

interface IHomePageProps {
  showModal?: boolean;
  grid: boolean;
}

export const HomePage = ({ grid }: IHomePageProps) => {
  const focusContext = useFocusProvider(PAGE_ID);

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
        //   const nextTarget4 = mapCtx?.mapObj.getNextNavigate(
        //     ENavigationDirection.RIGHT,
        //   );
        //   if (!nextTarget4) return;
        //   nextTarget4 && mapCtx?.mapObj.updateMapData(nextTarget4);
        break;
    }
  });

  const generateContent = (rowId: number) => {
    const data = [
      "Block 1",
      "Block 2",
      "Block 3",
      "Block 4",
      "Block 1",
      "Block 2",
      "Block 3",
      "Block 4",
    ];

    const items = data.map((content, itemIndex) => {
      return (
        <Card
          focusKey={itemIndex === 2 && rowId === 1 ? TEST_FOCUS_KEY : undefined}
          context={focusContext}
          parentIndex={rowId}
          index={itemIndex}
          key={itemIndex}
        >
          {content}
        </Card>
      );
    });

    return items;
  };

  useEffect(() => {
    focusListener.register(PAGE_ID, focusContext);

    setTimeout(() => {
      focusContext.setFocus(TEST_FOCUS_KEY);
      // setFocusState(focusContext.mapObj.getFocusedItem());
    }, 3000);

    return () => {
      focusListener.deregister(PAGE_ID);
    };
  }, []);

  return (
    <FocusContainer
      context={focusContext}
      enableGrid={grid}
      onChildGotFocused={(containerId) =>
        console.log(">>>>>> Container Focused ", containerId)
      }
      onChildGotBlurred={(containerId) =>
        console.log(">>>>>> Container Blurred ", containerId)
      }
    >
      <View style={getStyle().content}>
        <FocusLane
          index={0}
          context={focusContext}
          onChildGotFocused={(laneId) =>
            console.log(">>>>>> Lane Focused ", laneId)
          }
          onChildGotBlurred={(laneId) =>
            console.log(">>>>>> Lane Blurred ", laneId)
          }
        >
          <View style={getStyle().row}>{generateContent(0)}</View>
        </FocusLane>

        <FocusLane
          index={1}
          context={focusContext}
          onChildGotFocused={(laneId) =>
            console.log(">>>>>> Lane Focused ", laneId)
          }
          onChildGotBlurred={(laneId) =>
            console.log(">>>>>>> Lane Blurred ", laneId)
          }
        >
          <View style={getStyle().row}>{generateContent(1)}</View>
        </FocusLane>
        <FocusLane
          index={2}
          context={focusContext}
          onChildGotFocused={(laneId) =>
            console.log(">>>>>> Lane Focused ", laneId)
          }
          onChildGotBlurred={(laneId) =>
            console.log(">>>>>>> Lane Blurred ", laneId)
          }
        >
          <View style={getStyle().row}>{generateContent(2)}</View>
        </FocusLane>
      </View>
    </FocusContainer>
  );
};

const getStyle = (isItemFocused?: boolean) => {
  return {
    content: {
      maxWidth: 1024,
      maxHeight: 720,
      display: "flex",
      flexDirection: "column",
    },

    row: {
      maxWidth: 1024,
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
