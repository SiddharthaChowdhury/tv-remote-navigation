import { useRef, useEffect, memo } from "react";
import { IFocusLaneProps } from "./types";
import utilNavigation from "./utilNavigation";
import React from "react";

const _FocusLane = ({
  children,
  context,
  index,
  onChildGotBlurred,
  onChildGotFocused,
}: React.PropsWithChildren<IFocusLaneProps>) => {
  const laneFocusedState = useRef<boolean>(false);
  const laneId = useRef<string>("");
  const { focusRef, mapObj } = context;

  useEffect(() => {
    if (!focusRef.current || index === undefined) return;
    const { rows, vs, layer } = focusRef.current;

    if (!rows || !vs) return;
    laneId.current = utilNavigation.generateLaneId(layer, vs, index);
  }, []);

  useEffect(() => {
    const focusedLaneId = mapObj.getFocusedLaneId();
    if (focusedLaneId) {
      if (
        laneFocusedState.current === true &&
        focusedLaneId !== laneId.current &&
        onChildGotBlurred
      ) {
        laneFocusedState.current = false;
        onChildGotBlurred(laneId.current);
        console.log(">>>>>>>>>>>>>>>> Lane BLURRED REF=0002", laneId.current);
      }

      if (
        laneFocusedState.current === false &&
        focusedLaneId === laneId.current &&
        onChildGotFocused
      ) {
        laneFocusedState.current = true;
        onChildGotFocused(laneId.current);
        console.log(">>>>>>>>>>>>>>>> Lane FOCUSED REF=0002", laneId.current);
      }
    }
  }, [mapObj.activeState.layer, mapObj.activeState.vs, mapObj.activeState.row]);
  // console.log(">>>> ### ________________________ ", laneId.current);

  return <>{children}</>;
};

export const FocusLane = memo(_FocusLane, (oldProps, newProps) => {
  const lastFocusedItemId = newProps.context.lastFocusedItemId;
  const activeFocusedItemId = newProps.context.activeFocusedItemId;
  const activeLayer = newProps.context.mapObj.activeState.layer;

  if (!newProps.context.focusRef.current.vs || !activeFocusedItemId)
    return false;

  const thisLaneId = utilNavigation.generateLaneId(
    activeLayer,
    newProps.context.focusRef.current.vs,
    newProps.index
  );
  const activeLaneId = utilNavigation.itemIdToLaneId(activeFocusedItemId);

  // Current lane is Focused!
  if (activeLaneId === thisLaneId) {
    return lastFocusedItemId === activeFocusedItemId; // ReRender when new Item is focused
  }

  // Current lane is NOT-Focused
  // BUT last focused Item was in THIS-Lane => ReRender this lane (Blur State)
  if (!lastFocusedItemId) return false;
  const lastFocusedLaneId = utilNavigation.itemIdToLaneId(lastFocusedItemId);

  return lastFocusedLaneId !== thisLaneId;
});
