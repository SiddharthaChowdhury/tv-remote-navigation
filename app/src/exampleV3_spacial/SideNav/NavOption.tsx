import React, { useEffect, useRef, useState } from "react";
import { IFocusItemProps } from "../../navigationV2/types";
import { FocusItem } from "../../navigationV2/FocusItem";
import { View, Text } from "../../react-native.components";

export interface IOptionProps extends IFocusItemProps {
  focusKey?: string;
}

export const NavOption = ({
  focusKey,
  context,
  parentIndex,
  index,
  children,
}: React.PropsWithChildren<IOptionProps>) => {
  const focusId = useRef<string | null>(null);
  const [isFocused, setFocus] = useState(false);

  useEffect(() => {
    // if (focusId.current)
    // console.log(
    //   ">>>>>>>> Item focus status update ",
    //   JSON.stringify({ isFocused, focusId: focusId.current })
    // );
  }, [isFocused]);

  return (
    <FocusItem
      focusKey={focusKey}
      context={context}
      parentIndex={parentIndex}
      index={index}
      onFocus={(id) => {
        focusId.current = id;
        setFocus(true);
      }}
      onBlur={() => setFocus(false)}
    >
      <View style={getStyle(isFocused).item}>
        <Text>{children}</Text>
      </View>
    </FocusItem>
  );
};

const getStyle = (isItemFocused?: boolean) => {
  return {
    item: {
      width: 80,
      height: 30,
      backgroundColor: isItemFocused ? "#3eed47" : "#989696",
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
