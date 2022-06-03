import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { cleanMask } from "masks-br";

export function MaskedCellInput({
  mask,
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, cleanMask(value));
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={mask && mask(value)}
      onChange={onChange}
      onBlur={onBlur}
      variant="flushed"
      w="36"
    />
  );
}
