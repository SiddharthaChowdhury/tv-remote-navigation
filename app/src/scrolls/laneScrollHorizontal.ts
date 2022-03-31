import { animateLaneScroll } from "../animations/animate_LaneScroll";
import { ENavigationDirection, INavigationMapMeta } from "../navigation/types";
import utilNavigation from "../navigation/utilNavigation";

const laneScrollHorizontal = (
  targetItem: INavigationMapMeta,
  toward: ENavigationDirection
) => {
  const targetElementId = utilNavigation.getElementIdFromNavMapMeta(targetItem);
  const targetElement = document.getElementById(targetElementId);

  if (!targetElement) return;

  const parentRow = targetElement.closest('[data-type="row"]') as HTMLElement;

  if (!parentRow) return;

  const SCREENx2 = 1280;
  const parentRect = parentRow.getBoundingClientRect();
  const parentX = parentRect.x;
  const parentX2 = parentRect.right;

  const elementRect = targetElement.getBoundingClientRect();
  const targetWidth = elementRect.width;

  if (toward === ENavigationDirection.RIGHT) {
    const newLaneX2 = parentX2 - targetWidth;

    let offset = parentX - targetWidth - 25;
    if (newLaneX2 < SCREENx2) return;

    animateLaneScroll(parentRow, offset);
  }
  if (toward === ENavigationDirection.LEFT) {
    if (elementRect.x >= 0) return;
    const offset = parentX + +Math.abs(elementRect.x);
    animateLaneScroll(parentRow, offset);
  }
};

export default laneScrollHorizontal;
