# **Quick start**

Below is a very minimal example of the focus management library

    type ItemProps = React.PropsWithChildren<IFocusItemProps>;
    const ItemComponent = (props: ItemProps) => {
      const [isFocused, setFocus] = useState(false);

      return (
        <FocusItem
          context={props.context}
          parentIndex={props.parentIndex}
          index={props.index}
          onFocus={id => {
            setFocus(true);
          }}
          onBlur={() => setFocus(false)}>
          <View style={getStyle(isFocused).item}>
            <Text>{props.children}</Text>
          </View>
        </FocusItem>
      );
    };

    const PAGE_ID = 'DEMO_PAGE_1
    export const DemoPageMinimal = () => {
      const focusContext = useFocusProvider(PAGE_ID);

      useEffect(() => {
        focusListener.register(PAGE_ID, focusContext);

        return () => {
          // On unmount deregister from listener stack
          focusListener.deregister(PAGE_ID);
        };
      }, []);

      useTVEventHandler((evt: any) => {
        if (evt.eventKeyAction === 0) return; // 0 === press down, 1 === press up

        const keyType = evt.eventType.toUpperCase();
        switch (keyType) {
          case "LEFT":
            focusListener.navigate(ENavigationDirection.LEFT, PAGE_ID);
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
        }
      });

      const data = [
        ['ITEM-1', 'ITEM-2', 'ITEM-3'],
        ['ITEM-1', 'ITEM-2', 'ITEM-3'],
        ['ITEM-1', 'ITEM-2', 'ITEM-3'],
      ];

      return (
        <FocusContainer context={focusContext} enableGrid>
          <View style={getStyle().content}>
            {data.map((rowData, rowIndex) => (
              <FocusLane context={focusContext} index={rowIndex} key={rowIndex}>
                <View style={getStyle().lane}>
                  {rowData.map((item, itemIndex) => (
                    <ItemComponent
                      context={focusContext}
                      parentIndex={rowIndex}
                      index={itemIndex}
                      key={itemIndex}>
                      {item}
                    </ItemComponent>
                  ))}
                </View>
              </FocusLane>
            ))}
          </View>
        </FocusContainer>
      );
    };

    const getStyle = (isItemFocused?: boolean) => {
      return StyleSheet.create({
        content: {
          display: 'flex',
          flexDirection: 'column',
        },

        lane: {
          display: 'flex',
          flexDirection: 'row',
        },
        item: {
          width: 100,
          height: 100,
          backgroundColor: isItemFocused ? '#f9c5c5' : '#ffffff',
          margin: 2,
        },
      });
    };

# The building blocks are described below

## **`useFocusProvider(contextName?: string, layer?: number)`**

This hook initiates the focus library. It returns a context (not react Context) which exposes basic navigation properties and functions. Most importantly the returned context from this hook is a **required** props for each of the building blocks described below.

## **`<FocusContainer>`**

This wrapper components defines a container/vs(virtual space). This is last-component/grandparent of the focusable tree. This is were the navigation engine generates the the navigable map object onComponent mount from the shared `focusRef` prop.

### Props

- **`children`**: (Required): Ofc not as a props
- **`context`** : (Required) this props takes the returned context variable from `useFocusProvider()` hook.
- **`onChildGotFocused`**: (Optional) this callback listener gets called EACH time the container is focused (NOTE: Not called when focus changes between the children of this container)
- **`onChildGotBlurred`**: (Optional) same behavior as _`onChildGotFocused`_ props but it is called when the container loses focus or Blurred.
- **`enableGrid`**: (Optional) enables Grid movement with the container.

---

## **`<FocusLane>`**

This Wrapper component should be used to wrap all focusable _`<FocusItem />`_

### Props

- **`children`**: (Required): Ofc not as a props
- **`index`** : (Required) In index of the Lane within the container. Index can not be duplicate
- **`context`** : (Required) Same as the prop in _`FocusContainer`_ component.
- **`onChildGotFocused`**: (Optional) Same as prop in _`FocusContainer`_ component
- **`onChildGotBlurred`**: (Optional) Same as prop in _`FocusContainer`_ component

---

## **`<FocusItem>`**

Any focusable item should be wrapped within this component. This component is responsible for compiling the parent child relation hierarchy. In this component the hierarchical relationship is established between the grandparent (FocusContainer), parent (FocusLane) if any and this child (FocusItem), in the process `focusRef` in `context` is updated with the relationship.

### Props

- **`parentIndex`** : (Required): Unique index of the lane (FocusLane), If FocusLane component is not used then just pass the lane index as value.
- **`context`** : (Required) Same as the prop in _`FocusContainer`_ and _`FocusLane`_ component.
- **`index`** : (Optional) Index of the focusable component (FocusItem). **IMPORTANT**: This is kept optional to be able to switch between focusable state. This means if `index === undefined` current item will not be focused.
- **`focusKey`**: (Optional) will set a userDefined focus key, which can be later used (by passing to `setFocus(<FOCUS_KEY>);`) to programmatically set focus from any where. Please use alpha-numeric with underscores as key (for example: 'PLAY_BUTTON_21')
- **`onFocus`**: (Optional) will be called when current item is focused
- **`onBlur`**: (Optional) Will be called when current item loses its focus

---

## **`ActiveListener`**

This class is responsible for maintaining instances of contexts, and is a must have, when we have modals(layers) involved. It exposes `navigate()` and `setFocus()` function which helps in specifically targeting a particular layer and their respective contexts.

### Usage

- **`register()`**: To use active listener you need to `register()` it first on componentMount. This function takes a the mandatory param `name` (a unique name) as the ID to the 2nd param `context` (this you get as return value of `useFocusProvider()`)
- **`deregister()`**: on componentDismount to clear the context from the ActiveListener. It take the registered `name` as a param.
- **`navigate()`**: This function helps you navigate in particular direction
- **`setFocus()`**: This helps in changing current focus an a particular `<FocusItem/>`
