import { useEffect, useState } from "react";
import { withFocusProvider } from "../navigation/withFocusProvider";
import { ENavigationDirection, IFocusProvider } from "../navigation/types";
import { FocusContainer } from "../navigation/FocusContainer";
import { Card } from "./card/Card";
import { FocusLane } from "../navigation/FocusLane";
import { View, useTVEventHandler } from "./react-native.components";

const TEST_FOCUS_KEY = "BLA_BLA_1";

interface IHomePageOwnProps {
  grid: boolean;
}
interface IHomePageProps extends IHomePageOwnProps, IFocusProvider {}

const _HomePage = ({ grid, context }: IHomePageProps) => {
  const [_, setFocusState] = useState<any>(null);

  useTVEventHandler((evt: any) => {
    const keyType = evt.eventType.toUpperCase();
    switch (keyType) {
      case "LEFT":
        context.mapObj.navigate(ENavigationDirection.LEFT);
        break;
      case "RIGHT":
        context.mapObj.navigate(ENavigationDirection.RIGHT);
        break;
      case "UP":
        context.mapObj.navigate(ENavigationDirection.UP);
        break;
      case "DOWN":
        context.mapObj.navigate(ENavigationDirection.DOWN);
        //   const nextTarget4 = mapCtx?.mapObj.getNextNavigate(
        //     ENavigationDirection.RIGHT,
        //   );
        //   if (!nextTarget4) return;
        //   nextTarget4 && mapCtx?.mapObj.updateMapData(nextTarget4);
        break;
    }

    setFocusState(context.mapObj.getFocusedItem());
  });

  const generateContent = (rowId: number) => {
    const data = ["Block 1", "Block 2", "Block 3", "Block 4"];

    const items = data.map((content, itemIndex) => {
      return (
        <Card
          focusKey={itemIndex === 2 && rowId === 1 ? TEST_FOCUS_KEY : undefined}
          context={context}
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
    setTimeout(() => {
      context.mapObj.setFocus(TEST_FOCUS_KEY);
      setFocusState(context.mapObj.getFocusedItem());
      console.log(">>>>>> TIMEOUT ", context.mapObj.activeState);
    }, 3000);
  }, []);

  return (
    <FocusContainer
      context={context}
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
          context={context}
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
          context={context}
          onChildGotFocused={(laneId) =>
            console.log(">>>>>> Lane Focused ", laneId)
          }
          onChildGotBlurred={(laneId) =>
            console.log(">>>>>>> Lane Blurred ", laneId)
          }
        >
          <View style={getStyle().row}>{generateContent(1)}</View>
        </FocusLane>
      </View>
    </FocusContainer>
  );
};

export const HomePage = withFocusProvider<IHomePageOwnProps>(_HomePage, {
  layer: 0,
});

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
