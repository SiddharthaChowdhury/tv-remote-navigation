import React, { useEffect, useRef, useState } from "react";
import { IFocusItemProps } from "../../navigationV2/types";
import { View, Text } from "../../react-native.components";
import { FocusItem } from "../../navigationV2/FocusItem";

export interface ICardProps extends IFocusItemProps {
  focusKey?: string;
}

export const NavOption = ({
  focusKey,
  context,
  parentIndex,
  index,
  children,
}: React.PropsWithChildren<ICardProps>) => {
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
      width: 100,
      height: 50,
      backgroundColor: isItemFocused ? "#6bf663" : "#d5ffc8",
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
