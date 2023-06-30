import { useEffect, useRef } from "react";
import { IFocusContainerProps } from "./types";
import utilNavigation from "./utilNavigation";

export const FocusContainer = ({
  render,
  context,
  behavior,
  vsId,
  onChildGotFocused,
  onChildGotBlurred,
}: IFocusContainerProps) => {
  const containerFocusedState = useRef<boolean>(false);
  const containerId = useRef<string>("");
  if (vsId) {
    context.focusRef.current.vs = vsId;
  }

  // Registering new container in the map
  // useEffect(() => {
  //   if (!context.focusRef.current) return;
  //   const { rows, vs } = context.focusRef.current;

  //   if (!rows || !vs) return;
  //   context.mapObj.addNewVs(rows, vs, behavior);
  //   containerId.current = utilNavigation.generateContainerId(vs);
  //   console.log(">>>>>>>>>> VS 2", vs, vsId, context.focusRef);
  //   context.focusRef.current = {};
  //   console.log(">>>>>>>>>>Clearing  VS", context.focusRef);
  //   // clear focusRef for next use
  // }, [context.focusRef.current.rows]);

  // When switching from default layout to grid layout movement (or vice-versa)
  useEffect(() => {
    if (behavior !== undefined && context.mapObj) {
      if (!context.focusRef.current?.vs) return;
      const { vs } = context.focusRef.current;

      context.mapObj.changeVsNavBehavior(vs, behavior);
    }
  }, [behavior]);

  // Detect container focus and blur
  useEffect(() => {
    const focusedVsId = context.mapObj.getFocusedVsId();
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
  }, [context.mapObj.activeState.vs]);

  // console.log(">>>>>>>>> CONTAINER RERENDER", context.focusRef);
  // return <>{children}</>;
  return render(context);
};
