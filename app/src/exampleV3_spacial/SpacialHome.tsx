import { useEffect } from "react";
import { focusListener } from "../navigationV2/focusListener";
import { ENavigationDirection, TVsBehavior } from "../navigationV2/types";
import { useFocusProvider } from "../navigationV2/useFocusProvider";
import { View, useTVEventHandler } from "../react-native.components";
import { FocusContainer } from "../navigationV2/FocusContainer";
import { Content, TEST_FOCUS_KEY } from "./Content/Content";
import { SideNav } from "./SideNav/SideNav";

const PAGE_ID = "SPACIAL_PAGE";

interface ISpacialHomeProps {
  behavior: TVsBehavior;
}

export const SpacialHomeExV3 = ({ behavior }: ISpacialHomeProps) => {
  const focusContext = useFocusProvider();

  useTVEventHandler((evt: any) => {
    const keyType = evt.eventType.toUpperCase();

    switch (keyType) {
      case "LEFT":
        focusListener.navigate(ENavigationDirection.LEFT, PAGE_ID);
        console.log(">>>>>>>>>> MAP Obj", focusContext.mapObj.map);
        break;
      case "RIGHT":
        focusListener.navigate(ENavigationDirection.RIGHT, PAGE_ID);
        break;
      case "UP":
        focusListener.navigate(ENavigationDirection.UP, PAGE_ID);
        break;
      case "DOWN":
        focusListener.navigate(ENavigationDirection.DOWN, PAGE_ID);
        break;
      case "SELECT":
        focusListener.onSelectUp(PAGE_ID);
        break;
    }
  });

  useEffect(() => {
    focusListener.register(PAGE_ID, focusContext);

    setTimeout(() => {
      focusListener.setFocus(TEST_FOCUS_KEY);

      // setFocusState(focusContext.mapObj.getFocusedItem());
    }, 3000);

    return () => {
      focusListener.deregister(PAGE_ID);
    };
  }, []);

  return (
    <View style={getStyle().content}>
      <View>
        <FocusContainer
          context={focusContext}
          vsId={[0, 0]}
          render={(containerCtx) => <SideNav containerContext={containerCtx} />}
        />
      </View>
      <View>
        <FocusContainer
          context={focusContext}
          vsId={[1, 0]}
          behavior={behavior}
          onChildGotFocused={(containerId) =>
            console.log(">>>>>> Container Focused ", containerId)
          }
          onChildGotBlurred={(containerId) =>
            console.log(">>>>>> Container Blurred ", containerId)
          }
          render={(containerContext) => {
            console.log(">>>>> ### 1 ", containerContext.focusRef);
            return <Content containerContext={containerContext} />;
          }}
        />
      </View>
    </View>
  );
};

const getStyle = () => {
  return {
    content: {
      maxWidth: 1280,
      maxHeight: 1000,
      display: "flex",
      flexDirection: "row",
    },
  };
};
