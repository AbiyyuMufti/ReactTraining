/* eslint-disable react-hooks/exhaustive-deps */
import {
    useEffect,
    useReducer,
    MouseEvent
  } from "react";

  
type THookState<T extends HTMLDivElement> = {
  count: number;
  event: MouseEvent<T, globalThis.MouseEvent>;
  arg: any
};

const getReducer = <T extends HTMLDivElement>() => (
  _: THookState<T>,
  action: { type: "update"; payload: THookState<T> }
): THookState<T> => {
  switch (action.type) {
    case "update":
      return { ...action.payload };
    default:
      throw new Error();
  }
};

const getInitialState = <T extends HTMLDivElement>(): THookState<T> => ({
  count: 0,
  event: null as any,
  arg: null as any
});

const useSingleAndDoubleClick = <T extends HTMLDivElement>(
  singleClickHandler: (event: MouseEvent<T, globalThis.MouseEvent>, arg?: any) => void,
  doubleClickHandler: (event: MouseEvent<T, globalThis.MouseEvent>, arg?: any) => void,
  delay: number = 250
) => {
  const reducer = getReducer<T>();
  const initialState = getInitialState<T>();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (state.count === 1) singleClickHandler(state.event, state.arg);
      dispatch({ type: "update", payload: { count: 0, event: null as any, arg: null} });
    }, delay);

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (state.count === 2) doubleClickHandler(state.event, state.arg);

    return () => clearTimeout(timer);
  }, [state.count]);

  return (event: THookState<T>["event"], arg?: any) =>
    dispatch({ type: "update", payload: { count: state.count + 1, event, arg: arg } });
};

export default useSingleAndDoubleClick;