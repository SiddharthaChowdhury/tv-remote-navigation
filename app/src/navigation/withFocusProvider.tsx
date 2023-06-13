import React, { FC, ReactElement, useRef } from "react";
import NavigationMap from "./NavigationMap";
import { IFocusProviderContext, TFocusRef } from "./types";

export type TypeMapContext = {
  mapObj: NavigationMap;
};

export const withFocusProvider = function <T>(
  Component: any,
  position: TFocusRef
) {
  return function (props: T) {
    const focusRef = useRef<TFocusRef>({ ...position });
    const { current: navMapObj } = useRef<NavigationMap>(new NavigationMap());

    const focusContext: IFocusProviderContext = {
      focusRef,
      mapObj: navMapObj,
    };

    return <Component {...props} context={focusContext} />;
  };
};
