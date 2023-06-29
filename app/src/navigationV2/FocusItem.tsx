import React, { memo, useRef } from "react";
import { useEffect, useState } from "react";
import { IFocusItemProps } from "./types";
import utilNavigation from "./utilNavigation";

const _FocusItem = ({
  children,
  focusKey,
  itemWidth,
  context,
  parentIndex,
  index,
  onFocus,
  onBlur,
  onKeyPress,
}: React.PropsWithChildren<IFocusItemProps>) => {
  const { focusRef, mapObj } = context;
  const currentId = useRef<string>("");
  const isFocused = useRef<boolean>(false);

  // Here we are finalizing/deriving the map
  useEffect(() => {
    if (!focusRef.current || index === undefined) {
      return;
    }

    if (!focusRef.current.vs) {
      const vsArr = mapObj.getNewNextVs();
      focusRef.current.vs = vsArr;
    }

    const currentVsId = focusRef.current.vs;
    const itemId = utilNavigation.generateItemId(
      currentVsId,
      parentIndex,
      index
    );

    if (!focusRef.current.rows) {
      focusRef.current.rows = {};
    }
    if (!focusRef.current.rows[parentIndex]) {
      focusRef.current.rows[parentIndex] = {
        lastFocusedItemIndex: 0,
        items: [],
      };
    }

    focusRef.current.rows[parentIndex].items[index] = {
      widthMedian: (itemWidth || 0) / 2,
      value: 0, // Summed value is derived in lane
      name: itemId,
    };

    // attaching custom focus key
    if (focusKey) {
      mapObj.attachCustomFocusToItem(focusKey, {
        vs: focusRef.current.vs,
        row: parentIndex,
        item: index,
      });
    }

    currentId.current = itemId;
  }, [index, parentIndex]);

  // This triggers onFocus and onBlur
  useEffect(() => {
    if (!mapObj.activeState) return;

    const focusedId = mapObj.getFocusedItem();

    if (focusedId === currentId.current && onFocus) {
      isFocused.current = true;

      onFocus(currentId.current);
    }

    if (focusedId !== currentId.current && isFocused.current) {
      if (onBlur) {
        onBlur(currentId.current);
      }
    }
  }, [mapObj.activeState.vs, mapObj.activeState.row, mapObj.activeState.item]);

  // This triggers onKeyPress
  useEffect(() => {
    if (context.mapObj.clickedItem.itemId === currentId.current && onKeyPress) {
      onKeyPress(currentId.current);
    }
  }, [
    context.mapObj.clickedItem.itemId,
    context.mapObj.clickedItem.repeatCount,
  ]);

  return <>{children}</>;
};

export const FocusItem = memo(_FocusItem, (oldProps, newProps) => {
  const lastFocusedItemId = newProps.context.lastFocusedItemId;
  const activeFocusedItemId = newProps.context.activeFocusedItemId;
  const clickedItemInfo = newProps.context.mapObj.clickedItem;

  if (
    !newProps.context.focusRef.current.vs ||
    !activeFocusedItemId ||
    newProps.index === undefined
  ) {
    return false; // ReRender
  }

  const thisItemId = utilNavigation.generateItemId(
    newProps.context.focusRef.current.vs,
    newProps.parentIndex,
    newProps.index
  );

  if (clickedItemInfo.itemId === thisItemId) {
    return false;
  }

  if (thisItemId === activeFocusedItemId || thisItemId === lastFocusedItemId) {
    return false; // ReRender
  }

  return true;
});
