import { useEffect } from "react";

export const View = ({ children, ...rest }: any) => (
  <div {...rest}>{children}</div>
);
export const Text = ({ children, ...rest }: any) => (
  <div {...rest}>{children}</div>
);

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
