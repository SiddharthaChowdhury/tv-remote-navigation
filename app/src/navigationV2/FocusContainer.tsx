import React, { createContext, memo, useEffect, useRef } from "react";
import { IFocusContainerProps } from "./types";
import utilNavigation from "./utilNavigation";

export const FocusScopeCtx = createContext<number[] | null>([]);

const _FocusContainer = ({
  children,
  context,
  vsId,
  name,
  behavior,
  onChildGotFocused,
  onChildGotBlurred,
}: React.PropsWithChildren<IFocusContainerProps>) => {
  const containerFocusedState = useRef<boolean>(false);
  const containerId = useRef<string>("");
  const { focusRef, mapObj } = context;

  // Registering new container in the map
  useEffect(() => {
    if (!focusRef.current) return;
    const { rows, vs } = focusRef.current;

    // console.log(">>>>>>>>>>>>> ", vsId, vs, mapObj.map);

    if (!rows || !vs) return;
    mapObj.addNewVs(rows, vs, behavior);
    containerId.current = utilNavigation.generateContainerId(vs);
    // context.clearFocusRef();
    context.focusRef.current = {};
  }, []);

  // When switching from default layout to grid layout movement (or vice-versa)
  useEffect(() => {
    if (behavior !== undefined && mapObj) {
      if (!focusRef.current?.vs) return;
      const { vs } = focusRef.current;

      mapObj.changeVsNavBehavior(vs, behavior);
    }
  }, [behavior]);

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
        // console.log(">>>>>>>>>>>>>>>> Container BLURRED", containerId.current);
      }

      if (
        containerFocusedState.current === false &&
        focusedVsId === containerId.current &&
        onChildGotFocused
      ) {
        containerFocusedState.current = true;
        onChildGotFocused(containerId.current);
        // console.log(">>>>>>>>>>>>>>>> Container FOCUSED", containerId.current);
      }
    }
  }, [mapObj.activeState.vs]);

  return (
    <FocusScopeCtx.Provider value={vsId!}>{children}</FocusScopeCtx.Provider>
  );
};

const MFocusContainer = memo(_FocusContainer, (_, newProps) => {
  const activeVs = utilNavigation.generateContainerId(
    newProps.context.mapObj.activeState.vs
  );
  const currentVs = utilNavigation.generateContainerId(newProps.vsId!);
  const lastFocusedItemId = newProps.context.lastFocusedItemId;
  const lastFocusedVs =
    lastFocusedItemId && utilNavigation.itemIdToContainerId(lastFocusedItemId);

  if (activeVs === currentVs || lastFocusedVs !== activeVs) return false;

  return true;
});

export const FocusContainer = (
  props: React.PropsWithChildren<IFocusContainerProps>
) => {
  const { current: containerVs } = useRef(
    props.vsId || props.context.mapObj.getNewNextVs()
  );

  return <MFocusContainer {...props} vsId={containerVs} />;
};
