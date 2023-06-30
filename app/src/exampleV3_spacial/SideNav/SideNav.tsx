import { IFocusProviderContext } from "../../navigationV2/types";
import { View, Text } from "../../react-native.components";
import { NavOption } from "../NavOption/NavOption";

type Props = {
  containerContext: IFocusProviderContext;
};

const layoutRows = [
  ["Option 1"],
  ["Option 2"],
  ["Option 3"],
  ["Option 4"],
  ["Option 5"],
];
export const SideNav = ({ containerContext }: Props) => {
  return (
    <View style={getStyle().content}>
      {layoutRows.map((row, rowIndex) => (
        <View key={rowIndex}>
          <NavOption
            context={containerContext}
            parentIndex={rowIndex}
            index={0}
          >
            <View>
              <Text>{row[0]}</Text>
            </View>
          </NavOption>
        </View>
      ))}
    </View>
  );
};

const getStyle = () => {
  return {
    content: {
      maxWidth: 100,
      maxHeight: 600,
      display: "flex",
      flexDirection: "column",
    },
  };
};
