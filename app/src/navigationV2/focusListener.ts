import { ENavigationDirection, IFocusProviderContext } from "./types";

type TListeners = Record<string, IFocusProviderContext>;

class FocusListener {
  private listeners: TListeners = {};
  private listenerStack: string[] = [];

  private getLastListenerName = () => {
    return this.listenerStack[this.listenerStack.length - 1];
  };

  public register = (name: string, context: IFocusProviderContext) => {
    if (this.listeners[name]) {
      console.warn(
        "[focus-lib]- focusListener: named listener already exists. Please use 'clearListener()' before registering again."
      );
      return;
    }
    this.listeners[name] = context;
    this.listenerStack.push(name);
  };

  public navigate = (
    direction: ENavigationDirection,
    registeredName: string
  ) => {
    const focusListenerName = this.getLastListenerName();
    if (focusListenerName !== registeredName) return;

    this.listeners[focusListenerName].navigate(direction);
  };

  public setFocus = (focusKey: string, registeredName?: string) => {
    if (!focusKey) return;
    const targetListenerName = registeredName || this.getLastListenerName();
    const context = this.listeners[targetListenerName];

    if (context) {
      context.setFocus(focusKey);
      return;
    }
    console.warn("[focus-lib]-  focusListener:setFocus: failed");
  };

  public deregister = (name: string) => {
    console.log("[focus-lib]-  focusListener:deregister: in process");
    const focusListenerName = this.getLastListenerName();
    if (this.listeners[name] && focusListenerName === name) {
      this.listenerStack.pop();

      // @ts-ignore
      this.listeners[name] = undefined;
      delete this.listeners[name];

      return;
    }

    console.warn(
      "[focus-lib]- focusListener:deregister: Either name was wrong or deregister is not in proper order (some child component's listener is live)."
    );
  };
}

export const focusListener = new FocusListener();
