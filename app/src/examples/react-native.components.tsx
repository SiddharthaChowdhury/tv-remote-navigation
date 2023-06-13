import { useEffect } from "react";

export const View = (props: any) => <div {...props} />;
export const Text = (props: any) => <div {...props} />;

export const useTVEventHandler = (
  callback: (evnt: { eventType: string }) => void
) => {
  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      e.preventDefault();

      let eventType = "";
      if (e.key === "ArrowRight") eventType = "right";
      if (e.key === "ArrowLeft") eventType = "left";
      if (e.key === "ArrowUp") eventType = "up";
      if (e.key === "ArrowDown") eventType = "down";

      return callback({ eventType });
    });
  }, []);
};
