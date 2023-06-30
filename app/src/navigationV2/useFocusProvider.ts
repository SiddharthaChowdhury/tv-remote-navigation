import { useEffect, useRef, useState } from "react";
import type {
  TFocusRef,
  IFocusProviderContext,
  ENavigationDirection,
  INavMapMeta,
} from "./types";
import NavigationMapV2 from "./NavSpacialMap";

export const useFocusProvider = () => {
  const focusRef = useRef<TFocusRef>({});
  const { current: navMapObj } = useRef<NavigationMapV2>(new NavigationMapV2());
  const lastFocusedItem = useRef<string | undefined>();
  const focusedItem = useRef<string | undefined>();

  const [_, setFocusedItem] = useState<string | undefined>();
  const [__, setClickedItem] = useState<string | undefined>();

  useEffect(() => {
    setFocusState();
  }, []);

  const clearFocusRef = () => {
    focusRef.current = {};
  };

  const setFocusState = () => {
    lastFocusedItem.current = focusedItem.current; // save last focused item
    focusedItem.current = navMapObj.getFocusedItem(); // set new focusItem
    setFocusedItem(focusedItem.current);
  };

  const navigate = (direction: ENavigationDirection) => {
    navMapObj.navigate(direction);
    setFocusState();
  };

  const setFocus = (key: string) => {
    navMapObj.setFocus(key);
    setFocusState();
  };

  const navigateManual = (mapMeta: INavMapMeta) => {
    navMapObj.updateMapData(mapMeta);
    setFocusState();
  };

  const triggerItemPress = () => {
    navMapObj.clickSelectedItem(undefined);
    if (navMapObj.clickedItem.itemId) {
      setClickedItem(
        `${navMapObj.clickedItem.itemId}:${navMapObj.clickedItem.repeatCount}`
      );
    }
  };

  const triggerItemRelease = () => {
    navMapObj.clickSelectedItem("clear");
    setClickedItem(undefined);
  };

  const focusContext: IFocusProviderContext = {
    focusRef,
    mapObj: navMapObj,
    activeFocusedItemId: focusedItem.current,
    lastFocusedItemId: lastFocusedItem.current,
    navigate,
    setFocus,
    navigateManual,
    triggerItemPress,
    triggerItemRelease,
    clearFocusRef,
  };

  return focusContext;
};
