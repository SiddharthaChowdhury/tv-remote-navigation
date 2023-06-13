## **`<FocusContainer>`**

This components defines a container/vs(virtual space). This is last-component/grandparent of the focusable tree. This is were the navigation engine generates the the navigable map object onComponent mount from the shared `focusRef` prop.

### Props

- **`focusRef`** : (Required) This ref holds a common hierarchical map of all the focusable element's position in the map and their respective Ids. This ref is used by the _`FocusContainer`_, _`FocusLane`_ and _`FocusItem`_ for internal use
- **`onChildGotFocused`**: (Optional) this callback listener gets called EACH time the container is focused (NOTE: Not called when focus changes between the children of this container)
- **`onChildGotBlurred`**: (Optional) same behavior as _`onChildGotFocused`_ props but it is called when the container loses focus or Blurred.
- **`enableGrid`**: (Optional) enables Grid movement with the container.

---

## **`<FocusLane>`**

This component should be used to wrap all focusable _`<FocusItem />`_

### Props

- **`index`** : (Required) In index of the Lane within the container. Index can not be duplicate
- **`focusRef`** : (Required) Same as the prop in _`FocusContainer`_ component.
- **`onChildGotFocused`**: (Optional) Same as prop in _`FocusContainer`_ component
- **`onChildGotBlurred`**: (Optional) Same as prop in _`FocusContainer`_ component

---

## **`<FocusItem>`**

Any focusable item should be wrapped with this component. **Please note:** `<FocusItem/>` can be used without `<FocusLane/>` but has to be inside a `<FocusContainer/>`. This component is responsible for compiling the parent child relation hierarchy. In this component the hierarchical relationship is established between the grandparent (FocusContainer), parent (FocusLane) if any and this child (FocusItem), in the process `focusRef` is updated with the relationship.

### Props

- **`parentIndex`** : (Required): Unique index of the lane (FocusLane), If FocusLane component is not used then just pass the lane index as value
- **`index`** : (Optional) Index of the focusable component (FocusItem). **IMPORTANT**: This is kept optional to be able to switch between focusable state. This means if `index === undefined` current item will not be focused.
- **`focusKey`**: (Optional) will set a userDefined focus key, which can be later used (by passing to `setFocus(<FOCUS_KEY>);`) to programmatically set focus from any where. Please use alpha-numeric with underscores as key (for example: 'PLAY_BUTTON_21')
- **`onFocus`**: (Optional) will be called when current item is focused
- **`onBlur`**: (Optional) Will be called when current item loses its focus

---

## Grid behavior

The `enableGrid` flag enables grid navigation. `<FocusContainer enableGrid> </FocusContainer>`

## TODO:

1. setFocus (use pubsub instead of useEffects) https://www.npmjs.com/package/mitt
2. Reorder map: append item (front and back) persisting the current focused Item
3. GridContainer
