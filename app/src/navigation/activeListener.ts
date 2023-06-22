import { ENavigationDirection, IFocusProviderContext } from "./types";

type TListeners = Record<string, IFocusProviderContext>;

class ActiveListener {
  private listeners: TListeners = {};
  private listenerStack: string[] = [];

  private getLastListenerName = () => {
    return this.listenerStack[this.listenerStack.length - 1];
  };

  public register = (name: string, context: IFocusProviderContext) => {
    if (this.listeners[name]) {
      console.warn(
        "[focus-lib]- activeListeners: named listener already exists. Please use 'clearListener()' before registering again."
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
    const activeListenerName = this.getLastListenerName();
    if (activeListenerName !== registeredName) return;

    this.listeners[activeListenerName].navigate(direction);
  };

  public setFocus = (focusKey: string, registeredName?: string) => {
    if (!focusKey) return;
    const targetListenerName = registeredName || this.getLastListenerName();
    const context = this.listeners[targetListenerName];

    if (context) {
      context.setFocus(focusKey);
      return;
    }
    console.warn("[focus-lib]-  activeListeners:setFocus: failed");
  };

  public deregister = (name: string) => {
    console.log("[focus-lib]-  activeListeners:deregister: in process");
    const activeListenerName = this.getLastListenerName();
    if (this.listeners[name] && activeListenerName === name) {
      this.listenerStack.pop();

      // @ts-ignore
      this.listeners[name] = undefined;
      delete this.listeners[name];

      return;
    }

    console.warn(
      "[focus-lib]- activeListeners:deregister: Either name was wrong or deregister is not in proper order (some child component's listener is live)."
    );
  };
}

export const focusListener = new ActiveListener();
