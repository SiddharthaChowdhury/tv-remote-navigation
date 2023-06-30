# **Quick start**

Below is a very minimal example of the focus management library

    type ItemProps = React.PropsWithChildren<IFocusItemProps>;
    const ItemComponent = (props: ItemProps) => {
      const [isFocused, setFocus] = useState(false);

      return (
        <FocusItem
          context={props.context}
          index={props.index}
          parentIndex={props.parentIndex}
          focusKey={focusKey}
          onFocus={id => {
            setFocus(true);
          }}
          onBlur={() => setFocus(false)}>
          <View style={getStyle(isFocused).item}>
            {props.children}
          </View>
        </FocusItem>
      );
    };

    const PAGE_ID = 'DEMO_PAGE_1
    export const DemoPageMinimal = () => {
      const focusContext = useFocusProvider();

      useEffect(() => {
        focusListener.register(PAGE_ID, focusContext);

        return () => {
          // On unmount deregister from listener stack
          focusListener.deregister(PAGE_ID);
        };
      }, []);

      useTVEventHandler((evt: any) => {
        // 0 === press down, 1 === press up
        if (evt.eventKeyAction === 0) return;

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
        <FocusContainer
          context={focusContext}
          behavior="grid"
          render={(containerContext) => {
            return (
              <View style={getStyle().content}>
                {data.map((rowData, rowIndex) => (
                  <FocusLane
                    context={containerContext}
                    index={rowIndex}
                    key={rowIndex}
                  >
                    <View style={getStyle().lane}>
                      {rowData.map((itemText, itemIndex) => (
                        <ItemComponent
                          context={containerContext}
                          parentIndex={rowIndex}
                          index={itemIndex}
                          key={itemIndex}
                        >
                          <Text>{itemText}</Text>
                        </ItemComponent>
                      ))}
                    </View>
                  </FocusLane>
                ))}
              </View>
            )
          }}
        />
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

## **`useFocusProvider()`**

This hook initiates the focus library _(By creating an instance of the core `NavigationMap` class)_. It returns a context obj (not a react Context) which is a **required** props for `<FocusContainer/>`. Not diving deep into what this context contains but in the nut shell, it holds the map of the interrelationship between focusable items (`<FocusItem/>`), the
lanes `<FocusLane/>` and the containers `<FocusContainer/>`, additionally few a functions which helps in navigating between the Focusable items.

## **`<FocusContainer>`**

This wrapper components defines a container/vs(virtual space). This is last-component/grandparent of the focusable tree. This is were the navigation engine generates the the navigable map object onComponent mount from the shared `focusRef` prop.

### Props

- **`render(containerContext)`**: (Required): This prop takes a React.FC as value. This subject React.FC must use the `containerContext` as value for `context` props for the `FocusLane` and `FocusChild`.
- **`context`** : (Required) this props takes the returned context variable from `useFocusProvider()` hook.
- **vsId**: (Optional) To be used only when you need to organize containers at different positions. It takes a value of type `number[x,y]` where `x` and `y` denotes position of the container in page (based on coordinate geometry)
- **`onChildGotFocused`**: (Optional) this callback listener gets called EACH time the container is focused (NOTE: Not called when focus changes between the children of this container)
- **`onChildGotBlurred`**: (Optional) same behavior as _`onChildGotFocused`_ props but it is called when the container loses focus or Blurred.
- **`behavior`**: (Optional) can be `'default' | 'grid' | 'spacial-rows'`. Well the default value is `default` behavior. **NOTE: Special case -** if set to `spacial-rows`, in the focusable component `<FocusItem itemWidth={WIDTH_OF_TEASER}` the prop `itemWidth` will need a value, the value is basically the width of the focusable item (including the margins if any to function accurately).

---

## **`<FocusLane>`**

This Wrapper component should be used to wrap all focusable items _`<FocusItem />`_

### Props

- **`children`**: (Required): Ofc not as a props
- **`index`** : (Required) Is the unique numerical index of the Lane within the container.
- **`context`** : (Required) Check `render(containerContext)` prop in _`FocusContainer`_ component, for details.
- **`onChildGotFocused`**: (Optional) Same as prop in _`FocusContainer`_ component
- **`onChildGotBlurred`**: (Optional) Same as prop in _`FocusContainer`_ component

---

## **`<FocusItem>`**

This is the wrapper component for focusable item components. This component is responsible for compiling the parent child relation hierarchy. In this component the inter-relationship is established between the grandparent (FocusContainer), parent (FocusLane) and the child (FocusItem), in the process `focusRef` in `context` is updated with the generated relationship.

### Props

- **`context`** : (Required) Same as the prop in _`FocusContainer`_ and _`FocusLane`_ component.
- **`parentIndex`** : (Required): Unique numerical index of the lane (FocusLane), which wraps this `<FocusItem/>`
- **`index`** : (Optional) Index of the focusable component (FocusItem). **IMPORTANT**: This is kept optional to be able to switch between focusable state. This means if `index === undefined` current item will not be focused.
- **`focusKey`**: (Optional) will set a userDefined focus key, which can be later used (by passing to `setFocus(<FOCUS_KEY>);`) to programmatically set focus from any where. Please use alpha-numeric with underscores as key (for example: 'PLAY_BUTTON_21')
- **`onFocus`**: (Optional) will be called when current item is focused
- **`onBlur`**: (Optional) Will be called when current item loses its focus

---

## **`FocusListener`**

This class is responsible for maintaining multiple instances of contexts, and is a must have, when we have modals(layers) involved. It exposes `navigate()` and `setFocus()` function which helps in specifically targeting a particular layer and their respective contexts.

### How it works:

Simply put - the layer which is at the very top of the stack- gets all the focus attention! For example: lets say, we are on our HomePage which is _(Layer-0)_ and then we have a modal/dialog _(layer-1)_ open. In such cases, any navigation or focus change triggered will affect ONLY the `layer-1` i.e. the Modal/Dialog. Because, its `focusContext` is at the top stack in **FocusListener**. **IMPORTANT:** So when the modal is closed! Its is necessary to `deregister()` from the focusListener, for the HomePage (layer-0) to get its navigation/focusing capabilities back.

### Usage

- **`register()`**: To use active listener you need to `register()` it first on componentMount. This function takes a the mandatory param `name` (a unique name) as the ID to the 2nd param `context` (this you get as return value of `useFocusProvider()`)
- **`deregister()`**: on componentDismount to clear the context from the ActiveListener. It take the registered `name` as a param.
- **`navigate()`**: This function helps you navigate in particular direction
- **`setFocus()`**: This helps in changing current focus an a particular `<FocusItem/>`
- **`onSelectUp()`**: This function should be used to clear the click record from the navigation map
- **`onSelectDown()`**: This function is used trigger click on item
