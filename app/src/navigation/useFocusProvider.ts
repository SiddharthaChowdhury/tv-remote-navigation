import { useEffect, useRef, useState } from "react";
import NavigationMap from "./NavigationMap";
import {
  TFocusRef,
  IFocusProviderContext,
  ENavigationDirection,
  INavigationMapMeta,
} from "./types";

export const useFocusProvider = (basePosition: TFocusRef) => {
  const focusRef = useRef<TFocusRef>({ ...basePosition });
  const { current: navMapObj } = useRef<NavigationMap>(new NavigationMap());
  const lastFocusedItem = useRef<string | undefined>();
  const focusedItem = useRef<string | undefined>();

  const [_, setFocusedItem] = useState<string | undefined>();

  useEffect(() => {
    setFocusState();
  }, []);

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

  const readNextMove = (direction: ENavigationDirection) => {
    return navMapObj.getNextNavigate(direction);
  };

  const switchToLayer = (layer: number) => {
    navMapObj.switchLayer(layer);
    setFocusState();
  };

  const navigateManual = (mapMeta: INavigationMapMeta) => {
    navMapObj.updateMapData(mapMeta);
    setFocusState();
  };

  const focusContext: IFocusProviderContext = {
    focusRef,
    mapObj: navMapObj,
    activeFocusedItemId: focusedItem.current,
    lastFocusedItemId: lastFocusedItem.current,
    navigate,
    setFocus,
    readNextMove,
    switchToLayer,
    navigateManual,
  };

  return focusContext;
};
