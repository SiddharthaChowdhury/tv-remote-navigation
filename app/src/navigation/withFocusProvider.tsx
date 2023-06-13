import React, { FC, useRef } from "react";
import NavigationMap from "./NavigationMap";
import { IFocusProviderContext, TFocusRef } from "./types";

export type TypeMapContext = {
  mapObj: NavigationMap;
};

export const withFocusProvider = (Component: FC<any>, position: TFocusRef) => {
  const FocusContext = React.createContext<TypeMapContext | null>(null);

  return (props: any) => {
    const focusRef = useRef<TFocusRef>({ ...position });
    const { current: navMapObj } = useRef<NavigationMap>(new NavigationMap());

    const focusContext: IFocusProviderContext = {
      focusRef,
      mapObj: navMapObj,
    };

    return (
      <FocusContext.Provider value={{ mapObj: navMapObj }}>
        <Component {...props} context={focusContext} />
      </FocusContext.Provider>
    );
  };
};
