import { useRef, useEffect } from "react";
import { IFocusLaneProps } from "./types";
import utilNavigation from "./utilNavigation";
import React from "react";

export const FocusLane = ({
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

  return <>{children}</>;
};
