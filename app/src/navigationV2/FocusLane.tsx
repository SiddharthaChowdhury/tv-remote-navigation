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
    const { rows, vs } = focusRef.current;

    if (!rows || !vs) return;
    laneId.current = utilNavigation.generateLaneId(vs, index);

    let sum = 0;
    const itemsWithValue = rows[index].items.map((item) => {
      const updatedItem = { ...item, value: item.widthMedian + sum };
      sum += item.widthMedian;
      return updatedItem;
    });

    focusRef.current.rows![index].items = itemsWithValue;
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
      }

      if (
        laneFocusedState.current === false &&
        focusedLaneId === laneId.current &&
        onChildGotFocused
      ) {
        laneFocusedState.current = true;
        onChildGotFocused(laneId.current);
      }
    }
  }, [mapObj.activeState.vs, mapObj.activeState.row]);

  return <>{children}</>;
};

export const FocusLane = memo(_FocusLane, (_, newProps) => {
  const lastFocusedItemId = newProps.context.lastFocusedItemId;
  const activeFocusedItemId = newProps.context.activeFocusedItemId;
  const clickedItemInfo = newProps.context.mapObj.clickedItem;

  if (!newProps.context.focusRef.current.vs || !activeFocusedItemId)
    return false;

  const thisLaneId = utilNavigation.generateLaneId(
    newProps.context.focusRef.current.vs,
    newProps.index
  );
  const activeLaneId = utilNavigation.itemIdToLaneId(activeFocusedItemId);

  /*  
      Rerender CASE 1: Check if Clicked item was in the lane
      Rerender CASE 2: Check if current lane is focused (when navigating within the lane)
      Rerender CASE 3: Current lane is NOT-Focused. BUT last focused Item was in THIS-Lane => ReRender this lane (Blur State - navigating inter-lane)
   */

  // CASE 1:
  if (clickedItemInfo.itemId) {
    const clickedItemLaneId = utilNavigation.itemIdToLaneId(
      clickedItemInfo.itemId
    );

    // if clicked item belongs to this lane => rerender
    if (clickedItemLaneId === thisLaneId) {
      return false;
    }
  }

  // CASE 2:
  if (activeLaneId === thisLaneId) {
    return lastFocusedItemId === activeFocusedItemId; // ReRender when new Item is focused
  }

  // CASE 3:
  if (!lastFocusedItemId) return false;
  const lastFocusedLaneId = utilNavigation.itemIdToLaneId(lastFocusedItemId);

  return lastFocusedLaneId !== thisLaneId;
});
