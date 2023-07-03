import React, { memo, useContext, useRef } from "react";
import { useEffect, useState } from "react";
import { IFocusItemProps } from "./types";
import utilNavigation from "./utilNavigation";
import { FocusScopeCtx } from "./FocusContainer";

interface IFocusItemPropsWithCtx extends IFocusItemProps {
  vsId: number[] | null;
}

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
  vsId,
}: React.PropsWithChildren<IFocusItemPropsWithCtx>) => {
  const { focusRef, mapObj } = context;
  const currentId = useRef<string>("");
  const isFocused = useRef<boolean>(false);

  // Here we are finalizing/deriving the map
  useEffect(() => {
    if (!focusRef.current || index === undefined) {
      return;
    }

    if (!focusRef.current.vs) {
      const vsArr = vsId!;
      focusRef.current.vs = vsArr;
      // console.log(">>>>>>>>>>>> CTX #+++++", vsId, focusRef.current.vs);
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
  }, []);

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
    if (mapObj.clickedItem.itemId === currentId.current && onKeyPress) {
      onKeyPress(currentId.current);
    }
  }, [mapObj.clickedItem.itemId, mapObj.clickedItem.repeatCount]);

  return <>{children}</>;
};

const MFocusItem = memo(_FocusItem, (_, newProps) => {
  const lastFocusedItemId = newProps.context.lastFocusedItemId;
  const activeFocusedItemId = newProps.context.activeFocusedItemId;
  const clickedItemInfo = newProps.context.mapObj.clickedItem;

  if (!newProps.vsId || !activeFocusedItemId || newProps.index === undefined) {
    return false; // ReRender
  }

  const thisItemId = utilNavigation.generateItemId(
    newProps.vsId,
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

export const FocusItem = (props: React.PropsWithChildren<IFocusItemProps>) => {
  const VSS_ID = useContext(FocusScopeCtx);

  return <MFocusItem {...props} vsId={VSS_ID} />;
};
