import React, { memo, useRef } from "react";
import { useEffect, useState } from "react";
import { IFocusItemProps } from "./types";
import utilNavigation from "./utilNavigation";

const _FocusItem = ({
  children,
  focusKey,
  context,
  parentIndex,
  index,
  onFocus,
  onBlur,
}: React.PropsWithChildren<IFocusItemProps>) => {
  const { focusRef, mapObj } = context;
  const currentId = useRef<string>("");
  const [isFocused, setFocused] = useState(false);

  // Here we are finalizing/deriving the map
  useEffect(() => {
    if (!focusRef.current || index === undefined) {
      return;
    }

    const currentLayerId = focusRef.current.layer || 0;
    if (!focusRef.current.vs) {
      const vsArr = mapObj.getNewNextVs(currentLayerId.toString());
      focusRef.current.vs = vsArr;
    }
    const currentVsId = focusRef.current.vs;
    const itemId = utilNavigation.generateItemId(
      currentLayerId,
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

    const itemSet = new Set(focusRef.current.rows[parentIndex].items);
    itemSet.add(itemId);
    focusRef.current.rows[parentIndex].items = Array.from(itemSet);

    // attaching custom focus key
    if (focusKey) {
      mapObj.attachCustomFocusToItem(focusKey, {
        layer: focusRef.current.layer,
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
      setFocused(true);
      onFocus(currentId.current);
    }

    if (focusedId !== currentId.current && isFocused) {
      setFocused(false);
      if (onBlur) {
        onBlur(currentId.current);
      }
    }
  }, [
    mapObj.activeState.layer,
    mapObj.activeState.vs,
    mapObj.activeState.row,
    mapObj.activeState.item,
  ]);

  return <>{children}</>;
};

export const FocusItem = memo(_FocusItem, (_, newProps) => {
  const lastFocusedItemId = newProps.context.lastFocusedItemId;
  const activeFocusedItemId = newProps.context.activeFocusedItemId;

  if (
    !newProps.context.focusRef.current.vs ||
    !activeFocusedItemId ||
    !newProps.index
  )
    return false;

  const thisItemId = utilNavigation.generateItemId(
    newProps.context.focusRef.current.layer,
    newProps.context.focusRef.current.vs,
    newProps.parentIndex,
    newProps.index
  );

  if (thisItemId === activeFocusedItemId || thisItemId === lastFocusedItemId) {
    return false; // ReRender
  }

  return true;
});
