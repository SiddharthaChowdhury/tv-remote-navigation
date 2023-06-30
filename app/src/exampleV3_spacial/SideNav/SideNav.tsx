import { FocusLane } from "../../navigationV2/FocusLane";
import { IFocusProviderContext } from "../../navigationV2/types";
import { View } from "../../react-native.components";
import { NavOption } from "./NavOption";

type Props = { focusContext: IFocusProviderContext };
const layoutRows = [
  ["Option-1"],
  ["Option-1"],
  ["Option-1"],
  ["Option-1"],
  ["Option-1"],
];
export const SideNav = ({ focusContext }: Props) => {
  return (
    <View style={getStyle().content}>
      {layoutRows.map((rowContent, rowIndex) => {
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
            <View>
              {rowContent.map((content, itemIndex) => {
                return (
                  <NavOption
                    context={focusContext}
                    parentIndex={rowIndex}
                    index={0}
                    key={itemIndex}
                  >
                    {content}
                  </NavOption>
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
      maxHeight: 200,
      display: "flex",
      flexDirection: "column",
    },
  };
};
