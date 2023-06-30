import { FocusLane } from "../../navigationV2/FocusLane";
import { IFocusProviderContext } from "../../navigationV2/types";
import { View } from "../../react-native.components";
import { CardItem } from "../CardItem/CardItem";

type Props = {
  containerContext: IFocusProviderContext;
};

export const TEST_FOCUS_KEY = "BLA_BLA_1";
const layoutRows = [
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
];
export const Content = ({ containerContext }: Props) => {
  return (
    <View style={getStyle().content}>
      {layoutRows.map((rowContent, rowIndex) => {
        return (
          <FocusLane
            key={rowIndex}
            index={rowIndex}
            context={containerContext}
            //   onChildGotFocused={(laneId) =>
            //     // console.log(">>>>>> Lane Focused ", laneId)
            //   }
            //   onChildGotBlurred={(laneId) =>
            //     console.log(">>>>>> Lane Blurred ", laneId)
            //   }
          >
            <View style={getStyle().row}>
              {rowContent.map((content, itemIndex) => (
                <CardItem
                  focusKey={
                    itemIndex === 2 && rowIndex === 1
                      ? TEST_FOCUS_KEY
                      : undefined
                  }
                  context={containerContext}
                  parentIndex={rowIndex}
                  index={itemIndex}
                  key={itemIndex}
                >
                  {content}
                </CardItem>
              ))}
            </View>
          </FocusLane>
        );
      })}
    </View>
  );
};

const getStyle = (isItemFocused?: boolean) => {
  return {
    content: {
      maxWidth: 1200,
      maxHeight: 600,
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
