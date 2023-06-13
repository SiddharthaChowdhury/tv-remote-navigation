import React, { useEffect, useRef, useState } from "react";
import { IFocusItemProps } from "../../navigation/types";
import { FocusItem } from "../../navigation/FocusItem";
import { View, Text } from "../react-native.components";

export interface ICardProps extends IFocusItemProps {
  focusKey?: string;
}

export const Card = ({
  focusKey,
  context,
  parentIndex,
  index,
  children,
}: React.PropsWithChildren<ICardProps>) => {
  const focusId = useRef<string | null>(null);
  const [isFocused, setFocus] = useState(false);

  useEffect(() => {
    if (focusId.current)
      console.log(
        ">>>>>>>> Item focus status update ",
        JSON.stringify({ isFocused, focusId: focusId.current })
      );
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
      height: 100,
      backgroundColor: isItemFocused ? "#f9c5c5" : "#4a4a4a",
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
