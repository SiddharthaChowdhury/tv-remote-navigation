import { FocusLane } from "../../navigationV2/FocusLane";
import { IFocusProviderContext } from "../../navigationV2/types";
import { View } from "../../react-native.components";
import { CardItem } from "./CardItem";

type Props = { focusContext: IFocusProviderContext };
const layoutRows = [
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
];
export const TEST_FOCUS_KEY = "BLA_BLA_1";
export const Content = ({ focusContext }: Props) => {
  return (
    <View style={getStyle().content}>
      {layoutRows.map((rowContent, rowIndex) => {
        return (
          <FocusLane key={rowIndex} index={rowIndex} context={focusContext}>
            <View style={getStyle().row}>
              {rowContent.map((content, itemIndex) => {
                return (
                  <CardItem
                    focusKey={
                      itemIndex === 2 && rowIndex === 1
                        ? TEST_FOCUS_KEY
                        : undefined
                    }
                    context={focusContext}
                    parentIndex={rowIndex}
                    index={itemIndex}
                    key={itemIndex}
                  >
                    {content}
                  </CardItem>
                );
              })}
            </View>
          </FocusLane>
        );
      })}
    </View>
  );
};

const getStyle = () => {
  return {
    content: {
      maxWidth: 1080,
      maxHeight: 800,
      display: "flex",
      flexDirection: "column",
    },

    row: {
      maxWidth: 1080,
      display: "flex",
      flexDirection: "row",
    },
  };
};
