import { useEffect, useState } from "react";
import { FocusContainer } from "../navigation/FocusContainer";
import { FocusItem } from "../navigation/FocusItem";
import { FocusLane } from "../navigation/FocusLane";
import { IFocusItemProps, ENavigationDirection } from "../navigation/types";
import { useFocusProvider } from "../navigation/useFocusProvider";
import { View, useTVEventHandler, Text } from "./react-native.components";
import { focusListener } from "../navigation/activeListener";

type ItemProps = React.PropsWithChildren<IFocusItemProps>;
const MODAL_ID = "MODAL_SAMPLE";
const ItemComponent = (props: ItemProps) => {
  const [isFocused, setFocus] = useState(false);

  return (
    <FocusItem
      context={props.context}
      parentIndex={props.parentIndex}
      index={props.index}
      onFocus={(id) => {
        console.log(">>>>>>> Focused Item", id);
        setFocus(true);
      }}
      onBlur={() => setFocus(false)}
    >
      <View style={getStyle(isFocused).item}>
        <Text>{props.children}</Text>
      </View>
    </FocusItem>
  );
};

export const Modal = () => {
  const focusContext = useFocusProvider(MODAL_ID);

  useEffect(() => {
    focusListener.register(MODAL_ID, focusContext);

    return () => {
      focusListener.deregister(MODAL_ID);
    };
  }, []);

  useTVEventHandler((evt: any) => {
    if (evt.eventKeyAction === 0) return; // 0 === press down, 1 === press up
    const keyType = evt.eventType.toUpperCase();
    switch (keyType) {
      case "LEFT":
        focusListener.navigate(ENavigationDirection.LEFT, MODAL_ID);
        break;
      case "RIGHT":
        focusListener.navigate(ENavigationDirection.RIGHT, MODAL_ID);
        break;
      case "UP":
        focusListener.navigate(ENavigationDirection.UP, MODAL_ID);
        break;
      case "DOWN":
        focusListener.navigate(ENavigationDirection.DOWN, MODAL_ID);
        break;
    }
  });

  const data = [
    ["ITEM-1", "ITEM-2", "ITEM-3"],
    ["ITEM-1", "ITEM-2", "ITEM-3"],
    ["ITEM-1", "ITEM-2", "ITEM-3"],
  ];

  return (
    <FocusContainer context={focusContext} enableGrid>
      <View style={getStyle().content}>
        {data.map((rowData, rowIndex) => (
          <FocusLane context={focusContext} index={rowIndex} key={rowIndex}>
            <View style={getStyle().lane}>
              {rowData.map((item, itemIndex) => (
                <ItemComponent
                  context={focusContext}
                  parentIndex={rowIndex}
                  index={itemIndex}
                  key={itemIndex}
                >
                  {item}
                </ItemComponent>
              ))}
            </View>
          </FocusLane>
        ))}
      </View>
    </FocusContainer>
  );
};

const getStyle = (isItemFocused?: boolean) => {
  return {
    content: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "700px",
      height: "500px",
      backgroundColor: "#00000044",
      position: "absolute",
      left: 0,
      top: 0,
    },

    lane: {
      display: "flex",
      flexDirection: "row",
    },
    item: {
      width: 100,
      height: 100,
      backgroundColor: isItemFocused ? "#f9c5c5" : "#7b7b7b",
      margin: 2,
    },
  };
};

//
