import { ChangeEventHandler, FocusEventHandler, useReducer, useEffect } from 'react';

export default function useTextInput(onSetInputState?: (input: { value: string, isValid: boolean }) => void, onToValidate?: (value: string) => boolean) {
  const validate = onToValidate || (() => true);
  const inputReducer = (
    state: { value: string; isValid: boolean },
    action: { type: string; value: string | null }
  ) => {
    if (action.type === "USER_INPUT") {
      return { value: action.value || "", isValid: validate(action.value || "") };
    }
    if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: validate(state.value) };
    }
    return { value: "", isValid: false };
  }

  const [inputState, dispatchInput] = useReducer(
    inputReducer,
    { value: "", isValid: false }
  );

  useEffect(() => {
    onSetInputState && onSetInputState(inputState);
  }, [inputState, onSetInputState])

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatchInput({ type: "USER_INPUT", value: event.target.value });
  };

  const onBlurHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    dispatchInput({ type: "INPUT_BLUR", value: event.target.value });
  };

  return { inputState, onChangeHandler, onBlurHandler }
}


