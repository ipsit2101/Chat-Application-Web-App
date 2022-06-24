import React, { useCallback, useState } from "react";
import { Alert, Icon, Input, InputGroup } from "rsuite";

const EditableInput = ({initialVal, onSave, label = null, placeholder = "write your value", emptyMessage = "Input is empty", ...inputProps}) => {
  const [input, setInput] = useState(initialVal);
  const [isEditable, setIsEditable] = useState(false); // hook to make the texts editable

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const onEditClick = useCallback(() => {
    setIsEditable(p => !p);
    setInput(initialVal); // to make sure that the value is set to initial value
  }, [initialVal]);

  const onSaveClick = async () => {
    const trimmedVal = input.trim();
    if (trimmedVal === '') {
      Alert(emptyMessage, 4000);
    }

    if (trimmedVal !== initialVal) {
      await onSave(trimmedVal);
    }

    setIsEditable(false);
  }

  return (
    <div>
      {label}
      <InputGroup>
        <Input {...inputProps} placeholder = {placeholder} onChange = {onInputChange} value = {input} disabled = {!isEditable} />
        <InputGroup.Button onClick = {onEditClick}>
          <Icon icon = {isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>
        {isEditable && 
          <InputGroup.Button onClick = {onSaveClick}>
            <Icon icon = "check" />
          </InputGroup.Button>
        }
      </InputGroup>
    </div>
  )
};

export default EditableInput;
