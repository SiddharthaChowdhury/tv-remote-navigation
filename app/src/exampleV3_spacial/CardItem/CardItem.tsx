import React, { useEffect, useRef, useState } from "react";
import { IFocusItemProps } from "../../navigationV2/types";
import { View, Text } from "../../react-native.components";
import { FocusItem } from "../../navigationV2/FocusItem";

const getRandomSize = () => {
  function randomSize(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const sizes = [100, 300, 50, 20, 200, 150, 250, 170];
  return sizes[randomSize(0, 6)];
};

export interface ICardProps extends IFocusItemProps {
  focusKey?: string;
}

export const CardItem = ({
  focusKey,
  context,
  parentIndex,
  index,
  children,
}: React.PropsWithChildren<ICardProps>) => {
  const focusId = useRef<string | null>(null);
  const { current: size } = useRef<number>(getRandomSize());
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
      itemWidth={size}
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
      <View style={getStyle(size, isFocused).item}>
        <Text>{children}</Text>
      </View>
    </FocusItem>
  );
};

const getStyle = (size: number, isItemFocused?: boolean) => {
  return {
    item: {
      width: size || 100,
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
