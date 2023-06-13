import React, { useEffect, useRef } from "react";
import { IFocusContainerProps } from "./types";
import utilNavigation from "./utilNavigation";

export const FocusContainer = ({
  children,
  context,
  enableGrid,
  onChildGotFocused,
  onChildGotBlurred,
}: React.PropsWithChildren<IFocusContainerProps>) => {
  const containerFocusedState = useRef<boolean>(false);
  const containerId = useRef<string>("");
  const { focusRef, mapObj } = context;

  // Registering new container in the map
  useEffect(() => {
    if (!focusRef.current) return;
    const { rows, vs, layer } = focusRef.current;

    if (!rows || !vs) return;
    mapObj.addNewVs(rows, vs, layer, enableGrid);
    containerId.current = utilNavigation.generateContainerId(layer, vs);
  }, []);

  // When switching from default layout to grid layout movement (or vice-versa)
  useEffect(() => {
    if (enableGrid !== undefined && mapObj) {
      if (!focusRef.current?.vs) return;
      const { vs, layer } = focusRef.current;

      mapObj.changeVsNavBehavior(layer, vs, enableGrid);
    }
  }, [enableGrid]);

  // Detect container focus and blur
  useEffect(() => {
    const focusedVsId = mapObj.getFocusedVsId();
    if (focusedVsId) {
      if (
        containerFocusedState.current === true &&
        focusedVsId !== containerId.current &&
        onChildGotBlurred
      ) {
        containerFocusedState.current = false;
        onChildGotBlurred(containerId.current);
        console.log(">>>>>>>>>>>>>>>> Container BLURRED", containerId.current);
      }

      if (
        containerFocusedState.current === false &&
        focusedVsId === containerId.current &&
        onChildGotFocused
      ) {
        containerFocusedState.current = true;
        onChildGotFocused(containerId.current);
        console.log(">>>>>>>>>>>>>>>> Container FOCUSED", containerId.current);
      }
    }
  }, [mapObj.activeState.layer, mapObj.activeState.vs]);

  return <>{children}</>;
};
