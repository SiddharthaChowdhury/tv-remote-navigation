import { animateVSScroll } from "../animations/animate_VsScroll";
import { INavigationMapMeta, ENavigationDirection } from "../navigation/types";
import utilNavigation from "../navigation/utilNavigation";

const laneScrollVerical = (
  targetItem: INavigationMapMeta,
  toward: ENavigationDirection
) => {
  const vsIdStr = utilNavigation.vsNumberArrToStr(targetItem.vs);
  const laneIdStr = utilNavigation.generateLaneId(
    targetItem.layer,
    targetItem.vs,
    targetItem.row
  );
  const vs = document.getElementById(vsIdStr) as HTMLElement;
  const lane = document.getElementById(laneIdStr) as HTMLElement;
  if (!lane || !vs) return;

  const SCREEN_bottom = 720;
  const laneRect = lane.getBoundingClientRect();
  const vsRect = vs.getBoundingClientRect();
  console.log("RECT ", vsRect);

  if (toward === ENavigationDirection.DOWN) {
    if (laneRect.bottom > SCREEN_bottom) {
      const offset = vsRect.top - laneRect.height;
      animateVSScroll(vs, -Math.abs(offset));
    }
  }

  if (toward === ENavigationDirection.UP) {
    if (laneRect.y < 0) {
      const offset = vsRect.top + laneRect.height;

      animateVSScroll(vs, offset);
    }
  }
};

export default laneScrollVerical;
